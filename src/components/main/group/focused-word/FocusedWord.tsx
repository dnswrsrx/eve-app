import React from 'react';
import { WordList, Definitions, Phonetic, Definition } from '../../../models/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import './FocusedWord.scss';

interface FocusedWordProps {
  word: string,
  wordInfo: WordList,
}

interface DefinitionInterface {
  type: string,
  definition: string,
  example: string,
  image_url: string,
  emoji: string,
}

const FocusedWord = ({ word, wordInfo }: FocusedWordProps) => {
  const formattedWord = word.replace(' ', '_');

  const renderDefinitions = (): JSX.Element => {
    const definitions = wordInfo[word].apiDefinitions;
    if(!definitions || !definitions.length) {
      return <p>No definitions found.</p>
    }
    else {
      return definitions.map((definition: Definitions, index: number): JSX.Element => (
        <div key={`${definition.word}-${index}`} className="focused-word__definition-section">
          <h3 className="focused-word__heading-word">
            Variation: { definition.word }
          </h3>
          {
            // Rendering Phonetic Information
            definition.phonetics.map((phonetic: Phonetic, phoneticIndex: number): JSX.Element => (
              <div key={`${phonetic.text}-${phoneticIndex}`} className="focused-word__phonetic">
                <p className="focused-word__pronunciation">
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
          <div className="focused-word__definition-list">
            {
              //Rendering Definition
              definition.definitions.reduce((result: JSX.Element[], definition: Definition, definitionIndex: number): JSX.Element[] => {
                if(!definition.selected) return result;
                result.push(
                  <div key={`${definition.definition}-${definitionIndex}`} className="focused-word__definition-wrapper">
                    <p className="focused-word__type"><span className="bold">Type:</span> { definition.type }</p>
                    <p className="focused-word__definition"><span className="bold">Definition:</span> { definition.definition }</p>
                    {
                      definition.example &&
                      <p className="focused-word__example"><span className="bold">Example:</span> { definition.example }</p>
                    }
                    {
                      definition.synonyms &&
                      <>
                        <p><span className="bold">Synonyms:</span> </p>
                        <div className="focused-word__synonyms">
                          {
                            definition.synonyms.map((synonym: string) => (
                              <span key={synonym} className="focused-word__synonym">
                                { synonym }
                              </span>
                            ))
                          }
                        </div>
                      </>
                    }
                  </div>
                );
                return result;
              }, [])
            }
          </div>
        </div>
      ))
    }
  };

  return (
    <div className="focused-word">
      <div className="focused-word__definition-box">
        <h3 className="focused-word__word">
          { word }
        </h3>
        <div className="focused-word__dictionary-link-container">
          <a rel="noopener noreferrer" target="_blank" href={`https://www.merriam-webster.com/dictionary/${formattedWord}`}>
            Merriam Webster Dictionary <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        </div>
        { wordInfo[word].customDefinition && (
          <>
            <h2>Definition:</h2>
            <div className="focused-word__definition-wrapper" dangerouslySetInnerHTML={{ __html: wordInfo[word].customDefinition }}></div>
          </>
        )}
        {
          wordInfo[word].dictionaryUrl
            && <div className="focused-word__custom-dictionary-link-container">
                <a rel="noopener noreferrer" target="_blank" href={wordInfo[word].dictionaryUrl}>
                  Additional Dictionary Link <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
              </div>
        }
        <h3 className="focused-word__heading">Auto Generated Definitions:</h3>
        { renderDefinitions() }
      </div>
    </div>
  )
}

export default FocusedWord;
