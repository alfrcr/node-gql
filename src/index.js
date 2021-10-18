const { ApolloServer, gql } = require('apollo-server');
const { v4: uuid } = require('uuid');

const typeDefs = gql`
  type Todo {
    id: ID!
    content: String!
    status: TodoStatus!
  }

  enum TodoStatus {
    BACKLOG
    IN_PROGRESS
    DONE
  }

  type Query {
    listTodos: [Todo]
    getTodo(id: ID!): Todo
  }

  type Mutation {
    addTodo(content: String!, status: TodoStatus): Todo
    editTodo(id: ID!, content: String, status: TodoStatus): Todo
    deleteTodo(id: ID!): DeleteResponse
  }

  type DeleteResponse {
    ok: Boolean!
  }
`;

const todos = {};

const addTodo = (todo) => {
  const id = uuid();
  return (todos[id] = { ...todo, id });
};

addTodo({
  content: "I'm a leaf on the wind. Watch how I soar.",
  status: 'BACKLOG',
});
addTodo({ content: "We're all stories in the end.", status: 'BACKLOG' });
addTodo({ content: 'Woah!', status: 'BACKLOG' });

const resolvers = {
  Query: {
    listTodos: () => Object.values(todos),
    getTodo: (_, { id }) => todos[id],
  },
  Mutation: {
    addTodo: async (_, todo) => {
      return addTodo(todo);
    },
    editTodo: async (_, { id, ...todo }) => {
      if (!todos[id]) {
        throw new Error("Todo doesn't exist");
      }

      todos[id] = {
        ...todos[id],
        ...todo,
      };

      return todos[id];
    },
    deleteTodo: async (_, { id }) => {
      const ok = Boolean(todos[id]);
      delete todos[id];

      return { ok };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}graphql`); // eslint-disable-line no-console
});
