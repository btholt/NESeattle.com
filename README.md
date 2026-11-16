# NE Seattle Local Guide

A local's guide to Northeast Seattle, built with React and Vite and deployed to
GitHub Pages at https://neseattle.com.

## Development

Use Node.js 24 and the pnpm version pinned in `package.json`:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm --filter @workspace/local-guide dev
```

The frontend runs at http://localhost:8080. `PORT` and `BASE_PATH` can override
the defaults. The existing Express API can still be used during development
or on Replit; GitHub Pages does not run it or require a database.

## GitHub Pages deployment

The `Deploy GitHub Pages` workflow builds and publishes the frontend on pushes
to `main`, manual runs, and daily at 15:00 UTC. In repository **Settings > Pages**,
the source must be **GitHub Actions** and the custom domain must be
`neseattle.com`. The custom domain is configured in GitHub, not via a `CNAME`
file (Actions deployments ignore that file).

The events API is replaced on Pages by a static JSON snapshot generated using
the same provider and fallback logic as the Express endpoint. To enable event
listings, add a newly issued `TICKETMASTER_API_KEY` and/or `SEATGEEK_CLIENT_ID`
in **Settings > Secrets and variables > Actions**. Credentials are used only
during the build and are never included in the website. Without credentials,
the existing SeatGeek, Bandsintown, and EverOut calendar links are displayed.
Snapshots refresh with each deployment, rather than each visitor request.

To build the Pages version locally:

```sh
pnpm run typecheck:libs
pnpm --filter @workspace/local-guide typecheck
VITE_GITHUB_PAGES=true pnpm --filter @workspace/local-guide build
NODE_ENV=production pnpm --filter @workspace/scripts exec tsx build-pages-events.ts
pnpm --filter @workspace/local-guide serve
```

## PostgreSQL connection saturation

The Pages site does not use PostgreSQL. The shared `@workspace/db` package
defines a PostgreSQL pool, but the current API does not use it. If a separate
PostgreSQL server reports exhausted ordinary connections, an operator must
connect to the correct server through an administrator or reserved connection;
the alert alone does not identify sessions that are safe to terminate.

1. Reduce application pool sizes, instance counts, and retry pressure where
   appropriate while preserving an administrative connection. Account for all
   application instances and other clients when setting the connection budget.
2. With sufficient privileges to see other sessions, inspect live client
   sessions (do not share the results without reviewing sensitive metadata):

   ```sql
   SELECT pid, backend_start, datname, usename, application_name, client_addr,
          state, clock_timestamp() - state_change AS state_age,
          clock_timestamp() - xact_start AS transaction_age
   FROM pg_stat_activity
   WHERE backend_type = 'client backend' AND pid <> pg_backend_pid()
   ORDER BY xact_start NULLS LAST, state_change NULLS LAST;
   ```

   Confirm the session owner, application, database, state and age with the
   responsible operator. An old session or transaction is not by itself proof
   that it is stale. Never target administrative, replication, pooler, or
   otherwise required sessions. Termination rolls back an open transaction and
   can disrupt work. Immediately recheck the PID **and backend_start** and
   the other identifying fields before terminating each confirmed stale session
   individually. Replace the placeholders below with the verified PID, backend
   start timestamp, and current state; no match means no session is terminated:

   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE pid = <verified_pid>
     AND backend_start = <verified_backend_start>::timestamptz
     AND state = <verified_state>
     AND backend_type = 'client backend'
     AND pid <> pg_backend_pid();
   ```

   Quote the timestamp and state as SQL string literals. Do not automate or
   bulk terminate sessions; revalidate before every termination.
3. Before changing timeouts, record the effective values and their sources on
   the affected application connection:

   ```sql
   SELECT name, setting, unit, source, sourcefile, sourceline
   FROM pg_settings
   WHERE name IN ('idle_session_timeout', 'idle_in_transaction_session_timeout');
   ```

   Also record existing role/database overrides and the configuration
   management source of truth:

   ```sql
   SELECT r.rolname, d.datname, s.setconfig
   FROM pg_db_role_setting AS s
   LEFT JOIN pg_roles AS r ON r.oid = s.setrole
   LEFT JOIN pg_database AS d ON d.oid = s.setdatabase;
   ```

   Null role or database names indicate a setting for all roles or databases.
   Review the output before sharing it. `idle_session_timeout`
   requires PostgreSQL 14 or later; check the server version and managed-service
   restrictions. Choose bounded values with the application owner based on its
   normal workload; idle-session timeouts can interfere with connection poolers.
   Apply them through the supported configuration mechanism, preferably scoped to
   the affected application role and database rather than the administrator.
   For example, replace the placeholders with properly quoted identifiers and
   an agreed duration for each setting:

   ```sql
   ALTER ROLE <application_role> IN DATABASE <application_database>
     SET idle_in_transaction_session_timeout = '<duration>';
   ALTER ROLE <application_role> IN DATABASE <application_database>
     SET idle_session_timeout = '<duration>';
   ```

   Role/database settings affect new sessions, so recycle application
   connections in a controlled manner.
4. Monitor ordinary connection headroom, connection failures, transaction ages,
   and application errors. If limits are too aggressive, restore the recorded
   values at the same scope using the same configuration mechanism. For a
   role/database override that did not previously exist, use `ALTER ROLE ...
   IN DATABASE ... RESET` for that setting instead. Role settings take effect
   on new connections; if server configuration files were changed, reload them
   from the admin lane as required. Verify the effective values after rollback.

Ticketmaster credentials were previously committed in `.replit`. They have
been removed from that file but remain in Git history; revoke/rotate them
before configuring new credentials.

## Pointing NESeattle.com from Hover

The domain uses Hover's nameservers (`ns1.hover.com` and `ns2.hover.com`), so
keep them unchanged. Sign in to Hover, select **NESeattle.com > DNS**, and
replace the old website records with:

| Type | Hostname | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | btholt.github.io |

Remove the old apex A record pointing to `34.111.179.208` and any other
conflicting website A/AAAA records or `www` records. Do not change MX records,
email-related TXT records, or unrelated subdomains. The CNAME target contains
no `https://` prefix or repository path. Hover's default TTL is fine.

Optional IPv6 support: add four AAAA records for `@` with values
`2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, and
`2606:50c0:8003::153`.

Configure the custom domain on GitHub before changing DNS. Once DNS propagates
and GitHub provisions a certificate, enable **Enforce HTTPS** in
**Settings > Pages**. Provisioning can take up to 24 hours; DNS propagation
can take 24-48 hours. GitHub redirects `www.neseattle.com` to `neseattle.com`
when both records are correctly configured. Keep Replit running until the
domain is serving the new site successfully.

For additional takeover protection, verify `neseattle.com` under your personal
GitHub **Settings > Pages**, adding the unique TXT record GitHub supplies in
Hover before completing verification.

References: [GitHub custom domain configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
and [Hover DNS management](https://support.hover.com/support/solutions/articles/201000064728-managing-dns-records).
