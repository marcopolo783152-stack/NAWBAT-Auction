create extension if not exists pgcrypto;
create extension if not exists citext;

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name_en text not null,
  name_fa text not null,
  permissions jsonb not null default '[]'::jsonb,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email citext unique,
  phone text unique,
  password_hash text,
  full_name text not null,
  full_name_en text,
  user_type text not null check (user_type in ('buyer','customer','seller','business','staff')),
  status text not null default 'pending_verification' check (status in ('active','suspended','pending_verification','blocked')),
  kyc_status text not null default 'unverified' check (kyc_status in ('unverified','pending','verified','rejected','resubmit_required')),
  tazkira_number text,
  business_reg_number text,
  is_bidding_blocked boolean not null default false,
  is_selling_blocked boolean not null default false,
  preferred_language text not null default 'fa' check (preferred_language in ('fa','ps','en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists user_roles (
  user_id uuid not null references users(id) on delete cascade,
  role_id uuid not null references roles(id) on delete cascade,
  primary key (user_id, role_id)
);

create table if not exists admin_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  author_user_id uuid references users(id),
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists kyc_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  document_type text not null,
  document_number text,
  document_storage_key text,
  selfie_storage_key text,
  business_document_storage_key text,
  risk_level text not null default 'low' check (risk_level in ('low','medium','high')),
  status text not null default 'pending' check (status in ('pending','approved','rejected','resubmission_requested')),
  rejection_reason text,
  reviewer_user_id uuid references users(id),
  reviewed_at timestamptz,
  submitted_at timestamptz not null default now()
);

create table if not exists auctions (
  id uuid primary key default gen_random_uuid(),
  lot_number text unique not null,
  seller_id uuid not null references users(id),
  title_fa text not null,
  title_ps text,
  title_en text,
  description_fa text,
  description_ps text,
  description_en text,
  category text not null,
  province text not null,
  status text not null default 'draft' check (status in ('draft','pending_approval','scheduled','live','paused','ended','sold','unsold','cancelled')),
  starting_price_afn bigint not null check (starting_price_afn >= 0),
  current_bid_afn bigint not null check (current_bid_afn >= 0),
  reserve_price_afn bigint,
  min_increment_afn bigint not null default 100,
  buy_now_price_afn bigint,
  starts_at timestamptz,
  ends_at timestamptz not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references auctions(id) on delete cascade,
  bidder_id uuid not null references users(id),
  amount_afn bigint not null check (amount_afn > 0),
  max_proxy_afn bigint,
  source text not null default 'web',
  ip_address inet,
  device_fingerprint text,
  accepted boolean not null default true,
  rejection_reason text,
  created_at timestamptz not null default now()
);
create index if not exists bids_auction_created_idx on bids(auction_id, created_at desc);

create table if not exists watchlists (
  user_id uuid not null references users(id) on delete cascade,
  auction_id uuid not null references auctions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, auction_id)
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  auction_id uuid not null references auctions(id),
  buyer_id uuid not null references users(id),
  seller_id uuid not null references users(id),
  winning_bid_afn bigint not null,
  buyer_premium_afn bigint not null default 0,
  tax_afn bigint not null default 0,
  total_payable_afn bigint not null,
  payment_status text not null default 'pending',
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id),
  provider text not null default 'HesabPay',
  provider_reference text unique,
  amount_afn bigint not null,
  status text not null default 'pending',
  raw_webhook jsonb,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id),
  seller_id uuid not null references users(id),
  amount_afn bigint not null,
  status text not null default 'pending',
  provider_reference text,
  created_at timestamptz not null default now(),
  released_at timestamptz
);

create table if not exists disputes (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references invoices(id),
  opened_by uuid not null references users(id),
  assigned_to uuid references users(id),
  reason text not null,
  status text not null default 'under_review',
  resolution_notes text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists fraud_flags (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id text not null,
  flag_type text not null,
  severity text not null check (severity in ('low','medium','high','critical')),
  details text not null,
  status text not null default 'investigating',
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references users(id),
  action text not null,
  category text not null,
  target_type text,
  target_id text,
  details jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_created_idx on audit_logs(created_at desc);

create table if not exists platform_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references users(id),
  updated_at timestamptz not null default now()
);


insert into roles(key, name_en, name_fa, permissions, is_system) values
  ('superadmin','Super Admin','مدیر ارشد','["*"]'::jsonb,true),
  ('admin','Admin','مدیر اجرایی','["users.*","auctions.*","kyc.*","finance.read","disputes.*"]'::jsonb,true),
  ('auction_manager','Auction Manager','مدیر مزایده','["auctions.*","users.read"]'::jsonb,true),
  ('auctioneer','Auctioneer','مزایده‌دار','["auctions.read","auctions.bid_control"]'::jsonb,true),
  ('cataloger','Cataloger','مسئول ثبت کالا','["auctions.create","auctions.edit"]'::jsonb,true),
  ('finance','Finance','امور مالی','["finance.*","users.read"]'::jsonb,true),
  ('kyc','KYC Officer','مسئول تایید هویت','["kyc.*","users.read"]'::jsonb,true),
  ('support','Support','پشتیبانی','["support.*","users.read","disputes.read"]'::jsonb,true),
  ('logistics','Logistics','لوژستیک','["logistics.*","users.read"]'::jsonb,true),
  ('moderator','Moderator','ناظر','["users.read","auctions.read","fraud.read"]'::jsonb,true),
  ('buyer','Buyer','خریدار','["bidding.place","watchlist.manage"]'::jsonb,true),
  ('customer','Customer','مشتری','["watchlist.manage","orders.read"]'::jsonb,true),
  ('seller','Seller','فروشنده','["auctions.submit","seller.manage"]'::jsonb,true),
  ('business','Business Seller','فروشنده تجارتی','["auctions.submit","seller.manage","business.manage"]'::jsonb,true)
on conflict (key) do update
set name_en = excluded.name_en,
    name_fa = excluded.name_fa,
    permissions = excluded.permissions,
    is_system = excluded.is_system;


insert into platform_settings(key, value) values
  ('fees.buyer_premium_pct', '5'::jsonb),
  ('fees.seller_commission_schedule', '[
    {"min":0,"max":9999,"pct":20},
    {"min":10000,"max":99999,"pct":15},
    {"min":100000,"max":499999,"pct":10},
    {"min":500000,"max":1999999,"pct":10},
    {"min":2000000,"max":null,"pct":null,"negotiatedMinPct":5,"negotiatedMaxPct":10}
  ]'::jsonb),
  ('fees.seller_listing_afn', '0'::jsonb),
  ('fees.unsold_commission_pct', '0'::jsonb),
  ('fees.reserve_option_pct_of_reserve', '20'::jsonb),
  ('fees.featured_listing_afn', '{"min":250,"max":500}'::jsonb),
  ('fees.storage_afn', '{"min":50,"max":500,"basis":"daily_or_weekly_by_location"}'::jsonb),
  ('fees.delivery', '{"mode":"separate"}'::jsonb),
  ('fees.appraisal', '{"mode":"specialist_quote"}'::jsonb),
  ('fees.payment_processing', '{"mode":"provider_actual_or_included"}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();
