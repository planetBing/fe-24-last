import { FormOutlined, CheckOutlined } from "@ant-design/icons";
import {
  useCreateNewArticle,
  useDeleteArticle,
  useGetArticles,
} from "../hooks/api";
import * as S from "../styles/SideBar";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { Article } from "../model/types";
import ArticleItem from "./SideBarArticleItem";

export function SideBar() {
  const queryClient = useQueryClient();
  const { data: articlesData, isLoading, error } = useGetArticles();
  const { mutate: createNewArticle } = useCreateNewArticle(queryClient);
  const { mutate: deleteArticle } = useDeleteArticle(queryClient);
  const navigate = useNavigate();

  const handleNewArticle = () => {
    createNewArticle();
  };

  const handleDeleteArticle = async (articleId: string) => {
    deleteArticle(articleId);
    const articleIndex = articlesData.findIndex(
      (article: Article) => article._id === articleId
    );
    if (articleIndex > 0) {
      const previousArticle = articlesData[articleIndex - 1];
      navigate(`/${previousArticle._id}`);
    } else if (articlesData.length > 1) {
      const nextArticle = articlesData[articleIndex + 1];
      navigate(`/${nextArticle._id}`);
    } else {
      navigate(`/`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading Article</div>;

  return (
    <>
      <S.Wrapper>
        <S.TopBox>
          <S.UserInfo>사용자 이름</S.UserInfo>
          <S.NewArticleButton onClick={handleNewArticle}>
            <FormOutlined />
          </S.NewArticleButton>
        </S.TopBox>
        <S.MiddleBox>
          <div className="my-articles">개인 페이지</div>
          <S.Articles>
            {articlesData
              .filter((article: Article) => article.parent_id === "")
              .map((article: Article) => (
                <ArticleItem
                  key={article._id}
                  article={article}
                  articlesData={articlesData}
                  handleDeleteArticle={handleDeleteArticle}
                />
              ))}
          </S.Articles>
        </S.MiddleBox>
        <S.BottomBox>
          <S.TemplateButton>
            <CheckOutlined />
            <div>할 일 목록 템플릿</div>
          </S.TemplateButton>
        </S.BottomBox>
      </S.Wrapper>
    </>
  );
}
