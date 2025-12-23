-- 1. Enable vector extension (idempotent)
create extension if not exists vector;

-- 2. Add embedding column to EXISTING map_items table
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'map_items' and column_name = 'embedding') then
        alter table map_items add column embedding vector(768);
    end if;
end $$;

-- 3. Create or Replace RPC function for hybrid search on map_items
create or replace function search_map_items(
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  description text,
  category text,
  image_url text, -- mapped from whatever column holds the image
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    map_items.id,
    map_items.title,
    map_items.description,
    map_items.category,
    map_items.image_url,
    1 - (map_items.embedding <=> query_embedding) as similarity
  from map_items
  where 1 - (map_items.embedding <=> query_embedding) > match_threshold
  order by map_items.embedding <=> query_embedding
  limit match_count;
end;
$$;
