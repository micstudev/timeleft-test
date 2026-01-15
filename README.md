This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

What I built and Why?

- Opted for fully client-side implementation, leveraging TanStack Query for client-side caching, refetching for live updates and handling loading and error states easily. Reason behind this is the back-office dashboard needs functionality of live data feed to be effective for end user. Rather than say fetch in server component and pass to client component as this pattern is generally better for first page load and SEO but these don't really matter as much to us.
- Leveraged alot of custom hooks, to keep code clean and organised and be able to separate functionality and concerns into their own abstractions making it easier to maintain.... and reduce code bloat in files like page.tsx
- Used ShadCN ligthly here to lift he load on complex components like a Table
- Typed properly with typescript and also used JS Docs on complex components/hooks as I find its a great way to work documentation into the codebase on hover
-

Caching strategy:

- A mix of two cache layers, on the server at our api route + on the client with Tanstack Query
- On the server in our api route we cache responses for 30 seconds, the same time as dashboard refetch time is. This is so say we ad 10 users, then every 30 seconds we would only need 1 fetch to external API rather than 10 as the first new fetch is cached for 30 seconds
- Caching approach means we can scale our dashboard atlot easier, as requests will now not scale proportionately and this would reduces costs and mean when adding new features and integrations etc... we have more room to work with in terms of overall load on application
- With this approach it now means if we have 10 users we now only make 120 api calls and hour, rather than 12,000 with caching example below

// Without any caching:
10 users × refetch every 30s = 1,200 external API calls/hour

// With both layers:
10 users × refetch every 30s = ~120 external API calls/hour (90% reduction!)

What extra functionality other than requested?

- Added in the refetching on stale time state and live data indicator as it seems like it made sense. An end user should be abel to just keep the dashboard open on their laptop and it updates real time, no need for refreshes or page navigation.
- Tests, just unit tests are a must in my opinion, easy to write as you go and help when working across a team. E.G. on commit/push test should run and a developer should know did I blow up old functionality with my changes? easier to maintain across multiple developers
- Implemented rate limiting, would not says its massively critical for this especially with the cache layers but still a layer of security worth building in. Mainly just to show I understand how to use middleware (proxy) in nextjs for intercepting requests

If this was being built for real world what would I do different?

- I would use ReduxToolkit - could still use TanStackQuery but i would probably opt for ReduxToolkit as it makes api through to state manegment super easy, maintainable and has alot of features to leverage for caching or local storage etc.... Think its just a complete solution for a large project
- I would add E2E tests maybe something like Cypress where can have tests to run on push, or maybe merge to main running through github actions just to test front-end UI make sure everything is as expected
- Would approach with a more unified design system, probs more everything to shadCN and setup css tailwind variables etc....
- Implemented redis or something simialr for the rate limiting so can store ip adresses etc...
- Would add a layer of authentication too the api route - e.g. requests to it needing an API key or maybe only allowind requests from said application pages e.g. from within the site at /events or whatever
