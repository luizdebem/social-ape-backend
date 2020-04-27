let db = {
  users: [
    {
      userId: 'a46awg8486awg',
      email: 'user@email.com',
      handle: 'user', // Handle é nome de usuário
      createdAt: '2020-04-22T20:44:35.741Z',
      imageUrl: 'image/asgkjlçasg/klaçsg',
      bio: 'Hello, my name is user, follow if you like shitposting',
      website: 'https://user.com',
      location: 'Florianópolis, BR'
    }
  ],
  screams: [
    {
      userHandle: 'user',
      body: 'this is the scream body',
      createdAt: '2020-04-21T23:05:35.741Z',
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: 'user',
      screamId: 'ajasklglajsg',
      body: 'massa feio',
      createdAt: '2020-04-27T10:33:52.789Z'
    }
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'josias',
      read: 'true/false',
      screamId: 'ajasklglajsg',
      type: 'like/comment',
      createdAt: '2020-04-27T10:33:52.789Z'
    }
  ]
};

const userDetails = {
  // isso aqui vai ser usado no redux
  credentials: {
    userId: 'a46awg8486awg',
    email: 'user@email.com',
    handle: 'user',
    createdAt: '2020-04-22T20:44:35.741Z',
    imageUrl: 'image/asgkjlçasg/klaçsg',
    bio: 'Hello, my name is user, follow if you like shitposting',
    website: 'https://user.com',
    location: 'Florianópolis, BR'
  },
  likes: [
    {
      userHandle: 'user',
      screamId: 'hhashsas4AH45'
    },
    {
      userHandle: 'user',
      screamId: 'AKSGOpk6ASg54'
    }
  ]
};