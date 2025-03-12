# Colibri Feed App

## Description
This is a full-stack Twitter-like social media application where users can sign up, create posts, interact with posts through likes and comments, and manage their profiles.

## Features

### Authentication
- Sign up with email and password (with email verification)
- Sign up with Google authentication
- Sign in with email and password
- Log out

### Posts
- Create new post (with title, text, and optional photo)
- Edit existing post (update title, text, photo)
- Delete post
- View all my posts
- View posts of other users

### Feed
- Paginated feed of posts
- Posts sorted by chronologically
- Search posts by text

### Likes & Dislikes
- Like or dislike a post

### Comments
- Leave a comment on a post

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: NestJS + Firebase Firestore + Redis
- **Database**: Firestore (NoSQL)
- **Authentication**: Firebase Auth (Email, Google, and optionally SMS-based authentication)
- **Deployment**:
  - **Frontend**: Firebase Hosting
  - **Backend**: Firebase Functions
  - **Database**: Firebase Firestore

## Link to the deployment

https://colibri-feed-app.web.app/feed