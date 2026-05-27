💰 DevBudget

Know exactly what your app will cost before you build it.

DevBudget is a free, open source tool that helps developers estimate their monthly infrastructure costs across popular services — at any user scale. Built especially for African developers who need to know which services actually work in their region.
Show Image Show Image Show Image

✨ Features

5-question flow — answer simple questions, get instant cost breakdown
25+ services covered — storage, email, hosting, database, payments, auth
Scale simulation — see costs at 100, 1k, 10k, 100k users
Africa Mode — flags services that don't work for African developers and suggests local alternatives
Shareable results — share your stack estimate with anyone
100% frontend — no backend, no signup, no tracking


🛠️ Tech Stack
React + Vite · React Router · Pure CSS · JSON pricing data (no API calls)

🚀 Getting Started
bashgit clone https://github.com/yourusername/devbudget.git
cd devbudget
npm install
npm run dev

🌍 Africa Mode
When you indicate you're based in Africa, DevBudget surfaces:

⚠️ Services that don't accept Nigerian/African cards
⚠️ Services that block African developer signups (e.g. Stripe)
✅ Local alternatives that actually work (e.g. Paystack over Stripe)

This saves you from integrating a service for hours only to find out it won't accept your card.

🤝 Contributing
Pricing changes. Services launch and die. The community keeps this useful.
Edit src/data/services.json, add your source link, submit a PR.

⚠️ Disclaimer
Always confirm current pricing on each service's official website. Last verified: May 2025

Built by a developer who got tired of opening 10 pricing pages every time he starts a new project. 🌍