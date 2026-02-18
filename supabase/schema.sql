-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── Listings ────────────────────────────────────────────────────────────────

create table listings (
  id              uuid primary key default gen_random_uuid(),
  seller_id       uuid references auth.users(id) on delete cascade,

  -- Bike details
  brand           text not null,
  model           text not null,
  year            int  not null,
  frame_material  text not null,
  drivetrain      text not null,
  fork            text not null,
  shock           text,
  suspension      text not null,
  wheel_size      numeric not null,
  weight_kg       numeric,
  category        text not null,
  condition       text not null,
  description     text,
  images          text[] default '{}',

  -- Auction details
  status          text not null default 'draft',
  starting_bid    numeric not null,
  reserve_price   numeric,
  current_bid     numeric,
  buy_it_now      numeric,
  auction_starts_at timestamptz,
  auction_ends_at   timestamptz,
  created_at      timestamptz default now()
);

-- ─── Bids ────────────────────────────────────────────────────────────────────

create table bids (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid references listings(id) on delete cascade,
  bidder_id   uuid references auth.users(id) on delete cascade,
  amount      numeric not null,
  placed_at   timestamptz default now()
);

-- ─── Atomic bid function ─────────────────────────────────────────────────────
-- Prevents race conditions: validates and inserts the bid in one transaction.

create or replace function place_bid(
  p_listing_id uuid,
  p_bidder_id  uuid,
  p_amount     numeric
) returns void as $$
declare
  v_current_bid  numeric;
  v_ends_at      timestamptz;
  v_status       text;
begin
  -- Lock the listing row for the duration of this transaction
  select current_bid, auction_ends_at, status
    into v_current_bid, v_ends_at, v_status
    from listings
   where id = p_listing_id
     for update;

  if v_status != 'active' then
    raise exception 'Auction is not active';
  end if;

  if now() > v_ends_at then
    raise exception 'Auction has ended';
  end if;

  if p_amount <= coalesce(v_current_bid, 0) then
    raise exception 'Bid must be higher than current bid of %', coalesce(v_current_bid, 0);
  end if;

  insert into bids (listing_id, bidder_id, amount)
    values (p_listing_id, p_bidder_id, p_amount);

  update listings
     set current_bid = p_amount
   where id = p_listing_id;
end;
$$ language plpgsql security definer;

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table listings enable row level security;
alter table bids     enable row level security;

-- Anyone can read active listings
create policy "Public read listings"
  on listings for select
  using (true);

-- Sellers can insert their own listings
create policy "Sellers can create listings"
  on listings for insert
  with check (auth.uid() = seller_id);

-- Sellers can update their own draft listings
create policy "Sellers can update own listings"
  on listings for update
  using (auth.uid() = seller_id and status = 'draft');

-- Anyone can read bids
create policy "Public read bids"
  on bids for select
  using (true);

-- Authenticated users can place bids (via the place_bid function)
create policy "Authenticated users can bid"
  on bids for insert
  with check (auth.uid() = bidder_id);

-- ─── Realtime ────────────────────────────────────────────────────────────────
-- Enable realtime for listings and bids so clients receive live updates.

alter publication supabase_realtime add table listings;
alter publication supabase_realtime add table bids;
