import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import debounce from "../utils/debounce";
import { focusOnElement } from "../utils/focus";
import { Block } from "../model/types";
import {
  fetchArticleById,
  updateArticleTitle,
  createNewBlockOrElement,
} from "../services/api";
import { useArticles } from "../contexts/ArticlesProvider";
import * as S from "../styles/ArticleLayout";
import BlockBox from "./BlockBox";

function ArticleLayout() {
  const { id } = useParams<{ id: string }>();
  const { refetch: refetchArticles } = useArticles();
  const queryClient = useQueryClient();
  const {
    data: currentArticle,
    error,
    isLoading,
  } = useQuery(["article", id], () => fetchArticleById(id), {
    enabled: !!id,
  });
  const [focusedElementId, setFocusedElementId] = useState<string | null>(null);

  const [debouncedSaveTitle] = debounce(async (newTitle: string) => {
    try {
      await updateArticleTitle(id, newTitle);
      refetchArticles();
    } catch (error) {
      console.error("Error:", error);
    }
  }, 1000);

  const handleTitleChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newTitle = e.currentTarget.innerText;
    debouncedSaveTitle(newTitle);
  };

  const handleWrapperClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const wrapper = e.currentTarget;
    const paddingBottom = parseInt(
      window.getComputedStyle(wrapper).paddingBottom,
      10
    );
    const clickY = e.clientY;
    const wrapperRect = wrapper.getBoundingClientRect();
    const isInBottomPadding = clickY > wrapperRect.bottom - paddingBottom;

    if (isInBottomPadding) {
      if (currentArticle && currentArticle.blockList.length > 0) {
        const lastBlock =
          currentArticle.blockList[currentArticle.blockList.length - 1];
        try {
          const response = await createNewBlockOrElement(id, lastBlock._id);
          setFocusedElementId(response.newElementId);
          queryClient.invalidateQueries(["article", id]);
        } catch (error) {
          console.error("Failed to create new block:", error);
        }
      }
    }
  };

  useEffect(() => {
    if (focusedElementId) {
      focusOnElement(focusedElementId);
      setFocusedElementId(null);
    }
  }, [currentArticle, focusedElementId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading Article</div>;

  const { title, blockList } = currentArticle;

  return (
    <S.Wrapper onClick={handleWrapperClick}>
      <S.TitleBox
        contentEditable
        aria-placeholder="제목없음"
        onInput={handleTitleChange}
        suppressContentEditableWarning
      >
        {title}
      </S.TitleBox>
      <S.Content>
        {blockList.map((block: Block, index: number) => {
          return (
            <BlockBox
              key={`block-${block._id}`}
              blockData={block}
              blockIndex={index}
              setFocusedElementId={setFocusedElementId}
              currentArticle={currentArticle}
            />
          );
        })}
      </S.Content>
    </S.Wrapper>
  );
}

export default ArticleLayout;
