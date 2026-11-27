# black-friday-deal-finder-01

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/trtglhdry-commits/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/trtglhdry-commits/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

**DealBeacon — a real Black Friday deal finder.** 32 Black Friday and Cyber Monday deals, each one found and checked by the builder on 27 November 2026: the product, the store, the sale price, the usual price, the discount, a link to the product at that store, when the price was checked, and the source that showed it — plus an honest signal on every deal that says whether it is really a deal (a new low, a strong price, or a routine sale, with the evidence).

Search and filters by category, store and minimum discount all work, and deals sort by biggest discount, lowest price, best signal or name. The site is plain static files under `app/` — no build step, no network request at run time — and it works on a desktop and on a phone.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 (or `python3 -m http.server 8080 --directory app`).

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored library.

## How the deals were checked

Every price was read on 27 November 2026 from a live deals source that names the store (9to5Toys, TechRadar, Hunt4Freebies, MacRumors, Tom's Guide and the retailers' own Black Friday pages), and each deal card says when it was checked and where the price was read. Nothing on the site is invented: a price no store or deals source showed is not listed. The signal on each deal is the builder's own call — NEW LOW where the source reports a record or season low, STRONG DEAL for a deep cut below the usual price, ROUTINE SALE where the discount is modest or the product goes on sale often.

---

<sub>Entered on [make.fun](https://make.fun/?ref=yhmjkzq7&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
