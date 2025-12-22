-- 1. Enable vector extension
create extension if not exists vector;

-- 1.1 Create tables if they don't exist (since we are moving from Mock to Real)
create table if not exists venues (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text,
  vibes text[], -- Array of strings
  price_level int default 1,
  location text,
  lat float,
  lng float,
  image_url text,
  created_at timestamp with time zone default now()
);

-- 2. Add embedding column to venues (768 dimensions for Gemini Pro)
-- Check if column exists first to facilitate re-runs
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'venues' and column_name = 'embedding') then
        alter table venues add column embedding vector(768);
    end if;
end $$;

-- 3. Create RPC function for hybrid search
create or replace function search_venues(
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_vibes text[],
  filter_price_max int
)
returns table (
  id uuid,
  name text,
  description text,
  similarity float,
  dist_meters float -- Optional: if we want to add geo-distance later
)
language plpgsql
as $$
begin
  return query
  select
    venues.id,
    venues.name,
    venues.description,
    1 - (venues.embedding <=> query_embedding) as similarity,
    0.0::float as dist_meters -- Placeholder if geo is not enabled yet
  from venues
  where 1 - (venues.embedding <=> query_embedding) > match_threshold
  and (filter_vibes is null or venues.vibes && filter_vibes) -- Array overlap
  and (filter_price_max is null or venues.price_level <= filter_price_max)
  order by venues.embedding <=> query_embedding
  limit match_count;
end;
$$;
