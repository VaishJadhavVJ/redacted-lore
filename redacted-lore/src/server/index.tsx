import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

Devvit.addCustomPostType({
  name: 'Redacted Lore',
  height: 'tall',
  render: (_context) => {
    return (
      <vstack height="100%" width="100%" alignment="center middle" backgroundColor="#1a1a1b">
        <text size="large" color="#FF4500">Loading Redacted Lore...</text>
        <webview
          url="game.html"
          width="100%"
          height="100%"
        />
      </vstack>
    );
  },
});

Devvit.addMenuItem({
  label: 'New Lore Session',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    
    const post = await reddit.submitPost({
      title: 'Redacted Lore: Session 1',
      subredditName: subreddit.name,
      preview: {
        loading: true,
      },
    });
    ui.navigateTo(post);
  },
});

// THIS IS THE KEY LINE THAT WAS MISSING/BROKEN
export default Devvit;
