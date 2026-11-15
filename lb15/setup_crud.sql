-- Повний SQL-скрипт для Лабораторної роботи №15 (CRUD та ролі у Supabase, 7-9 балів)

-- 1. Таблиця прикладних ролей
create table if not exists public.user_roles (
    user_id uuid primary key references auth.users (id) on delete cascade,
    role text not null default 'user' check (role in ('user', 'admin'))
);

alter table public.user_roles enable row level security;
revoke all on table public.user_roles from anon, authenticated;

-- 2. Призначення ролей (підставте власні UUID з select id, email from auth.users;)
-- insert into public.user_roles (user_id, role)
-- values
--     ('UUID_ЗВИЧАЙНОГО_КОРИСТУВАЧА', 'user'),
--     ('UUID_АДМІНІСТРАТОРА', 'admin');

-- 3. Серверна функція перевірки адміністративних прав
create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.user_roles
        where user_id = (select auth.uid())
          and role = 'admin'
    );
$$;

revoke all on function private.is_admin() from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

-- 4. Політики доступу до таблиці public.books
drop policy if exists "Public can add books" on public.books;
drop policy if exists "Public can read books" on public.books;
drop policy if exists "Books can be read" on public.books;
drop policy if exists "Admins can insert books" on public.books;
drop policy if exists "Admins can update books" on public.books;
drop policy if exists "Admins can delete books" on public.books;

revoke all on table public.books from anon, authenticated;
grant select on table public.books to anon, authenticated;
grant insert (title, author) on table public.books to authenticated;
grant update (title, author) on table public.books to authenticated;
grant delete on table public.books to authenticated;

create policy "Books can be read"
on public.books for select
to anon, authenticated
using (true);

create policy "Admins can insert books"
on public.books for insert
to authenticated
with check ((select private.is_admin()));

create policy "Admins can update books"
on public.books for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can delete books"
on public.books for delete
to authenticated
using ((select private.is_admin()));

-- 5. Публічна RPC-функція перевірки ролі для інтерфейсу
create or replace function public.check_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
    select private.is_admin();
$$;

revoke all on function public.check_admin() from public, anon, authenticated;
grant execute on function public.check_admin() to authenticated;
