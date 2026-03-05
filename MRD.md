Product Requirements Document (PRD)

Product Name

CineScope

---

1. Overview

CineScope is a community-driven movie discussion and review platform where users can discover movies, write reviews, participate in discussions, and maintain personal watchlists.

The platform combines structured movie reviews with Reddit-style discussion threads.
Light AI assistance is used to detect spoiler risk and label review sentiment.

---

2. Goals

Primary Goals

- Enable users to review and discuss movies
- Build an interactive community around films
- Allow discovery of trending and top-rated movies
- Provide personal movie tracking (watchlist)

Secondary Goals

- Improve review quality with AI sentiment tagging
- Reduce spoiler exposure using AI detection

---

3. Target Users

- Movie enthusiasts
- Students and young audiences
- Casual viewers looking for opinions
- Community-driven reviewers

---

4. Core Features

4.1 Authentication

Users can create and manage accounts.

Requirements

- Register with email & password
- Login/logout
- JWT session
- Profile with username & avatar

---

4.2 Movies

Each movie has a dedicated page.

Requirements

- Movie title
- Poster
- Release year
- Genre
- Average rating
- Review count

---

4.3 Reviews

Users can rate and review movies.

Requirements

- Rating (1–5)
- Text review
- Edit/delete own review
- Like reviews
- Comment on reviews
- Display sentiment tag
- Spoiler warning indicator

---

4.4 Posts (Discussions)

Users can create discussion threads per movie.

Requirements

- Title
- Body text
- Tags (review, question, theory, news)
- Upvote/downvote
- Comments
- Sort by top/new

---

4.5 Comments

Nested discussion on posts and reviews.

Requirements

- Add comment
- Reply to comment
- Edit/delete own comment
- Like comments

---

4.6 Watchlist

Users can save movies.

Requirements

- Add/remove movie
- Personal list view
- Mark watched (optional)

---

4.7 Feed / Discovery

Home Feed includes

- Trending movies
- Recent reviews
- Popular discussions
- Top-rated movies

---

5. AI Features

5.1 Spoiler Detection

When user submits a review, AI evaluates spoiler risk.

Behavior

- If spoiler probability high → show warning badge
- Review still allowed
- Flag stored in DB

---

5.2 Sentiment Tagging

AI classifies review tone.

Labels

- Positive
- Mixed
- Negative

Displayed on review card.

---

6. User Flows

6.1 Write Review

User → open movie page → write review → submit →
Backend → AI analysis → save review → show on movie page

---

6.2 Create Discussion

User → movie page → create post → publish →
Visible in movie discussions + feed

---

6.3 Add to Watchlist

User → movie page → click watchlist →
Stored in profile list

---

7. Data Models (High Level)

User

- id
- username
- email
- passwordHash
- avatar
- createdAt

Movie

- id
- title
- year
- genre
- poster
- avgRating
- reviewCount

Review

- id
- userId
- movieId
- rating
- text
- sentiment
- spoilerFlag
- likes
- createdAt

Post

- id
- userId
- movieId
- title
- body
- tags
- votes
- createdAt

Comment

- id
- userId
- parentId
- parentType (post/review/comment)
- text
- likes
- createdAt

Watchlist

- id
- userId
- movieId
- addedAt

---

8. API Requirements

Auth
POST /auth/register
POST /auth/login

Movies
GET /movies
GET /movies/:id

Reviews
POST /reviews
GET /reviews/movie/:movieId
PUT /reviews/:id
DELETE /reviews/:id
POST /reviews/:id/like

Posts
POST /posts
GET /posts/movie/:movieId
POST /posts/:id/vote

Comments
POST /comments
GET /comments/:parentId

Watchlist
POST /watchlist/:movieId
GET /watchlist/me
DELETE /watchlist/:movieId

AI
POST /ai/analyze-review

---

9. Non-Functional Requirements

- Responsive UI
- Authentication security (hashed passwords)
- Rate limiting on posts/reviews
- Basic content moderation
- Error handling
- Loading states

---

10. Tech Stack

Frontend: React
Backend: Node.js + Express
Database: MongoDB
Auth: JWT
AI: OpenAI or Gemini API

---

11. Success Criteria

- Users can register and login
- Movies display correctly
- Reviews and posts persist
- Voti