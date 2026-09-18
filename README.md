# GitHub Dependency Evaluator

A small tool for one question: **will we regret adopting this open-source library in two years?**

It does not ask whether the library works today. GitHub’s public API is the data source. There is no score, no winner, and no stored user data — only facts and risk signals.

## What does “will we regret this” mean?

I did not pick stars or a score as the answer. You cannot judge a library from numbers alone. They indicate something, yes — but that is not enough.

Sometimes there is a library you simply cannot replace if you want to build something good. Sometimes a project looks abandoned, but in reality a big update is being prepared the whole time. Or right now there is nothing new to ship, and the project does not need it.

So “will we regret this” for me is not “how popular is it”. It is whether the repo still looks alive, without pretending I can turn that into `73/100`. The app shows facts and warnings. It does not decide for you.

## What I deliberately cut

Auth and a database. This project is only two parts: **Analyze** and **Compare**. The user does not enter data that we need to keep. Nothing is saved. We take GitHub data, process it, and show it.

I also cut a “winner” on the compare page. Same reason: I do not have the right to say which library is better.

## How I used AI

AI helped me create the code. The logic and the overall structure I did myself.

It wanted to put the backend in one file. I did not. I split it the way Django is supposed to look — views, services, serializers — and I kept PEP8-style imports. AI often skips that and just dumps everything together.

For the product, AI leaned toward a score. I made **two pages** instead: one to analyze a library, one to compare characteristics. I still do not give my opinion there, because I do not have the right to.

## Structure

```text
backend/                 Django API
  config/                settings, URLs
  github_api/
    views.py             HTTP
    services.py          GitHub client
    serializers.py       response shape
    evaluation.py        analysis + risk signals
    exceptions.py

frontend/                React + TypeScript (Vite)
  src/pages/             Analyze, Compare
  src/components/        cards, table, signals
  src/hooks/             data fetching
  src/api.ts             GET /api/repositories/:owner/:repo/
```

`GET /api/health/` is for Docker. `GET /api/repositories/{owner}/{repo}/` is the only product endpoint. Compare calls it twice.

## Run

**Docker** (app on [http://localhost:8080](http://localhost:8080)):

```bash
cp .env.example .env   # optional: set GITHUB_TOKEN
docker compose up --build
```

**Local**

```bash
# backend — http://127.0.0.1:8000
cd backend
python -m venv venv
venv\Scripts\activate    # or source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver

# frontend — http://localhost:5173  (proxies /api to Django)
cd frontend
npm install
npm run dev
```

A GitHub token is optional. Without one, the public rate limit is 60 requests per hour; one analysis uses several GitHub calls.
