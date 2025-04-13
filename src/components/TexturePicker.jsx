import React, { useState } from "react";
import usePlannerStore from "../store/plannerStore";
import furnitureCatalog from "../models/furnitureCatalog";
import styled from "@emotion/styled";

const Container = styled.div`
  padding: 16px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 12px;
  color: #666;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
`;

const TextureItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  ${(props) =>
    props.selected &&
    `
    border: 2px solid #1a73e8;
  `}
`;

const TexturePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TexturePicker = () => {
  const [selectedType, setSelectedType] = useState(null);
  const { setActiveTool } = usePlannerStore();

  const wallTextures = furnitureCatalog.filter(
    (item) => item.type === "wallTexture"
  );
  const floorTextures = furnitureCatalog.filter(
    (item) => item.type === "floorTexture"
  );

  const handleTextureClick = (texture) => {
    setSelectedType(texture.type);
    setActiveTool({
      type: "texture",
      texture: texture,
    });
    document.body.style.cursor = `url(/icons/paint-roller.svg) 0 24, auto`;
  };

  return (
    <Container>
      <Title>Текстуры</Title>

      <Section>
        <SectionTitle>Текстуры стен</SectionTitle>
        <Grid>
          {wallTextures.map((texture) => (
            <TextureItem
              key={texture.id}
              selected={selectedType === texture.type}
              onClick={() => handleTextureClick(texture)}
            >
              <TexturePreview src={texture.preview} alt={texture.name} />
            </TextureItem>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Текстуры пола</SectionTitle>
        <Grid>
          {floorTextures.map((texture) => (
            <TextureItem
              key={texture.id}
              selected={selectedType === texture.type}
              onClick={() => handleTextureClick(texture)}
            >
              <TexturePreview src={texture.preview} alt={texture.name} />
            </TextureItem>
          ))}
        </Grid>
      </Section>
    </Container>
  );
};

export default TexturePicker;
