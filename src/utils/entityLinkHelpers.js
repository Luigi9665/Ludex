// enum numerico usato dal backend per EntityLinkEntityType
export const ENTITY_LINK_ENTITY_TYPE = {
  Genre: 1,
  Tag: 2,
  Metadata: 3,
};

export const mapEntityTypeToEnum = (effectTypeStr) => ENTITY_LINK_ENTITY_TYPE[effectTypeStr] ?? 0;

// helper per costruire la request "giusta"
export const buildEntityLinkSuggestionRequest = ({
  entityType, // "Genre" | "Tag" | "Metadata"
  entityKey, // "2" | "45" | "FOCUS:STORY"
  defaultDelta = 5,
  focusQuestionId = null,
  maxSuggestions = 50,
}) => {
  const enumValue = mapEntityTypeToEnum(entityType);

  if (!enumValue) {
    throw new Error(`EntityType non valido per suggerimenti: ${entityType}`);
  }

  if (!entityKey) {
    throw new Error("EntityKey è obbligatorio per i suggerimenti.");
  }

  return {
    entityType: enumValue, // <<< numero, come in OptionEffectsModal
    entityKey,
    focusQuestionId,
    maxSuggestions,
    defaultDelta,
  };
};
