import { ArticlesModel } from "../model/index.js";

export async function getArticleById(articleId) {
  const article = await ArticlesModel.findById(articleId);

  if (!article) {
    throw new Error("Article not found");
  }

  return article.toObject();
}

export async function deleteArticleAndChildren(articleId) {
  await ArticlesModel.findByIdAndDelete(articleId);

  const children = await ArticlesModel.find({ parent_id: articleId });
  for (const child of children) {
    await deleteArticleAndChildren(child._id);
  }
}

export async function saveArticle(article) {
  await ArticlesModel.findByIdAndUpdate(article._id, article).exec();
}
