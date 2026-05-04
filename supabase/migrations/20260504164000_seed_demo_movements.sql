with category_ids as (
  select name, id from public.categories
),
channel_ids as (
  select name, id from public.channels
)
insert into public.movements (id, date, amount, type, category_id, channel_id, is_projected)
values
  (
    '10000000-0000-4000-8000-000000000001',
    '2026-05-01',
    1820000,
    'income',
    (select id from category_ids where name = 'Ventas'),
    (select id from channel_ids where name = 'Mayorista'),
    false
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    '2026-05-02',
    1260000,
    'income',
    (select id from category_ids where name = 'Ventas'),
    (select id from channel_ids where name = 'Minorista'),
    false
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    '2026-05-02',
    840000,
    'expense',
    (select id from category_ids where name = 'Proveedores Criticos'),
    (select id from channel_ids where name = 'Mayorista'),
    false
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    '2026-05-03',
    530000,
    'expense',
    (select id from category_ids where name = 'Servicios'),
    (select id from channel_ids where name = 'Minorista'),
    false
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    '2026-05-06',
    2050000,
    'income',
    (select id from category_ids where name = 'Cobranzas'),
    (select id from channel_ids where name = 'Mayorista'),
    true
  ),
  (
    '10000000-0000-4000-8000-000000000006',
    '2026-05-07',
    980000,
    'income',
    (select id from category_ids where name = 'Ventas'),
    (select id from channel_ids where name = 'Minorista'),
    true
  ),
  (
    '10000000-0000-4000-8000-000000000007',
    '2026-05-08',
    1560000,
    'expense',
    (select id from category_ids where name = 'Sueldos'),
    (select id from channel_ids where name = 'Mayorista'),
    true
  ),
  (
    '10000000-0000-4000-8000-000000000008',
    '2026-05-08',
    610000,
    'expense',
    (select id from category_ids where name = 'Servicios'),
    (select id from channel_ids where name = 'Minorista'),
    true
  ),
  (
    '10000000-0000-4000-8000-000000000009',
    '2026-05-09',
    1725000,
    'expense',
    (select id from category_ids where name = 'Proveedores Criticos'),
    (select id from channel_ids where name = 'Mayorista'),
    true
  ),
  (
    '10000000-0000-4000-8000-000000000010',
    '2026-05-10',
    420000,
    'expense',
    (select id from category_ids where name = 'Logistica'),
    (select id from channel_ids where name = 'Mayorista'),
    true
  )
on conflict (id) do update
set date = excluded.date,
    amount = excluded.amount,
    type = excluded.type,
    category_id = excluded.category_id,
    channel_id = excluded.channel_id,
    is_projected = excluded.is_projected;
