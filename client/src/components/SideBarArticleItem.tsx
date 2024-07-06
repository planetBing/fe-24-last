import { useState, useEffect } from "react";
import {
  RightOutlined,
  DownOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import * as S from "../styles/SideBar";
import { Article } from "../model/types";
import { useCreateNewChildArticle } from "../hooks/api";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

interface ArticleItemProps {
  article: Article;
  articlesData: Article[];
  handleDeleteArticle: (articleId: string) => void;
  depth?: number;
}

function ArticleItem({
  article,
  articlesData,
  handleDeleteArticle,
  depth = 0,
}: ArticleItemProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: createNewChildArticle } =
    useCreateNewChildArticle(queryClient);

  const toggleDropdown = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCreateNewChildArticle = () => {
    createNewChildArticle(article._id);
  };

  return (
    <>
      <S.SideBarArticleWrapper>
        <S.ArticleLeftSide depth={depth}>
          {isExpanded ? (
            <DownOutlined onClick={toggleDropdown} />
          ) : (
            <RightOutlined onClick={toggleDropdown} />
          )}
          <S.ArticleTitleBox>
            <S.ArticleLink to={`/${article._id}`} state={article}>
              {article.title || "제목 없음"}
            </S.ArticleLink>
          </S.ArticleTitleBox>
        </S.ArticleLeftSide>
        <S.ArticleButtonBox>
          <MinusOutlined onClick={() => handleDeleteArticle(article._id)} />
          <PlusOutlined onClick={handleCreateNewChildArticle} />
        </S.ArticleButtonBox>
      </S.SideBarArticleWrapper>
      {isExpanded &&
        articlesData
          .filter((childArticle) => childArticle.parent_id === article._id)
          .map((childArticle) => (
            <ArticleItem
              key={childArticle._id}
              article={childArticle}
              articlesData={articlesData}
              handleDeleteArticle={handleDeleteArticle}
              depth={depth + 1}
            />
          ))}
    </>
  );
}

export default ArticleItem;
