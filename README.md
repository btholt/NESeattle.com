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
