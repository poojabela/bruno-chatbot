import {
  index,
  jsonb,
  pgTableCreator,
  serial,
  text,
  vector,
} from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `doc-search_${name}`);

export const documents = pgTable(
  "documents",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    content_embeddings: vector("content_embeddings", {
      dimensions: 1536,
    }).notNull(),
    metadata: jsonb("metadata"),
  },
  (t) => [
    index("doc-search_title_idx").using("btree", t.title),
    index("doc-search_content_embeddings_idx").using(
      "hnsw",
      t.content_embeddings.op("vector_cosine_ops")
    ),
  ]
);
