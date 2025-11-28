
import { db } from '../src/db/index';
import { Article } from '../src/db/schema';
import fs from 'node:fs';
import path from 'node:path';

async function generateReadme() {
  console.log('Connecting to database...');
  await db.connect();

  console.log('Fetching articles...');
  const allArticles = await Article.find().sort({ readAt: -1 });

  console.log(`Found ${allArticles.length} articles.`);

  const grouped: Record<string, any[]> = {};

  // Group by "Month Day, Year"
  for (const article of allArticles) {
    const date = new Date(article.readAt);
    const dateString = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    if (!grouped[dateString]) {
      grouped[dateString] = [];
    }
    grouped[dateString].push(article);
  }

  let markdown = '# Today-I-Read\n\n';

  for (const dateString of Object.keys(grouped)) {
    markdown += `## ${dateString}\n\n`;
    for (const article of grouped[dateString]) {
      if (article.url) {
        markdown += `- [${article.title}](${article.url})\n`;
      } else {
        markdown += `- ${article.title}\n`;
      }
    }
    markdown += '\n';
  }

  const readmePath = path.join(process.cwd(), 'README.md');
  fs.writeFileSync(readmePath, markdown);
  console.log('README.md updated successfully!');
  process.exit(0);
}

generateReadme().catch((err) => {
  console.error(err);
  process.exit(1);
});
