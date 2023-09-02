import React from 'react';
import { cloneDeep } from 'lodash';
import { Definitions, Definition, Phonetic } from '../../../../models/models';
import './DefinitionBox.scss';

interface DefinitionBoxProps {
  definitions: Definitions[],
  setDefinitions: React.Dispatch<React.SetStateAction<Definitions[] | null>>,
}

const DefinitionBox = ({ definitions, setDefinitions }: DefinitionBoxProps): JSX.Element => {
  const handleDefinitionSelect = (e: React.MouseEvent<HTMLInputElement, MouseEvent>, mainIndex: number, definitionIndex: number): void => {
    const definitionsCopy = cloneDeep(definitions);

    definitionsCopy[mainIndex].definitions[definitionIndex].selected = e.currentTarget.checked;
    setDefinitions(definitionsCopy);
  }

  const renderDefinitions = () => (
    definitions.map((definition: Definitions, index: number) => (
      <div key={`${definition.word}-${index}`} className="definitions-row__definition-section">
        <h3 className="definitions-row__word">
          Variation: { definition.word }
        </h3>
        {
          // Rendering Phonetic Information
          definition.phonetics.map((phonetic: Phonetic, phoneticIndex: number) => (
            <div key={`${phonetic.text}-${phoneticIndex}`} className="definitions-row__phonetic">
              <p className="definitions-row__pronunciation">
                Pronunciation: { phonetic.text }
              </p>
              {
                phonetic.audio &&
                  <audio controls>
                    <source src={phonetic.audio} />
                  </audio>
              }
            </div>
          ))
        }
        {
          //Rendering Checkbox Field
          definition.definitions.map((definition: Definition, definitionIndex: number) => (
            <div key={`${definition.definition}-${definitionIndex}`} className="definitions-row__checkbox-row">
              <input
                type="checkbox"
                id={`${definition.type}-box-${definitionIndex}`}
                name={`${definition.type}-box-${definitionIndex}`}
                defaultChecked={definition.selected}
                onClick={(e) => handleDefinitionSelect(e, index, definitionIndex)}
              />
              <label htmlFor={`${definition.type}-box-${definitionIndex}`}>
                <div className="definitions-row__definition-wrapper">
                  <p className="definitions-row__type"><span className="bold">Type</span>: { definition.type }</p>
                  <p className="definitions-row__definition"><span className="bold">Definition</span>: { definition.definition }</p>
                  {
                    definition.example &&
                    <p className="definitions-row__example"><span className="bold">Example</span>: { definition.example }</p>
                  }
                  {
                    definition.synonyms && definition.synonyms.length > 0 &&
                    <>
                      <p><span className="bold">Synonyms</span>: </p>
                      <div className="definitions-row__synonyms">
                        {
                          definition.synonyms.map((synonym: string) => (
                            <span key={synonym} className="definitions-row__synonym">
                              { synonym }
                            </span>
                          ))
                        }
                      </div>
                    </>
                  }
                </div>
              </label>
            </div>
          ))
        }
      </div>
    ))
  );

  return (
    <div className="definitions-row">
      <fieldset>
        <legend>Definitions</legend>
        {
          definitions.length
            ? renderDefinitions()
            : <p>No definitions added yet.</p>
        }
      </fieldset>
    </div>
  )
}

export default DefinitionBox;
