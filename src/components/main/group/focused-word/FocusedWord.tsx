import React from 'react';
import { WordList, Definitions, Definition } from '../../../models/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import './FocusedWord.scss';

interface FocusedWordProps {
  word: string,
  wordInfo: WordList,
}

const FocusedWord = ({ word, wordInfo }: FocusedWordProps) => {

  const formattedWord = word.replace(' ', '_');
  const definitions = wordInfo[word].apiDefinitions;

  const phonetics = definitions?.map((d: Definitions) => d.phonetics.map(p => p.audio)).flat();
  const apiDefinitions = definitions?.map((d: Definitions) => d.definitions.filter(d => d.selected)).flat();

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

        {
          wordInfo[word].dictionaryUrl &&
          <div className="focused-word__custom-dictionary-link-container">
            <a rel="noopener noreferrer" target="_blank" href={wordInfo[word].dictionaryUrl}>
              Additional Dictionary Link <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          </div>
        }

        { phonetics?.length ?
          <>
            <h4 className="focused-word__heading-word">Pronunciations</h4>
            {
              phonetics.map((phonetic: string, index: number): JSX.Element => {
                return (<div key={`${phonetic}-${index}`} className="focused-word__phonetic">
                { <audio controls><source src={phonetic} /></audio> }
                </div>)
              })
            }
          </>
          : <></>
        }

        <h4 className="focused-word__heading-word">Definitions</h4>
        { wordInfo[word].customDefinition || apiDefinitions?.length ?
          <div className="focused-word__definition-list">
            { wordInfo[word].customDefinition &&
                <div className="focused-word__definition-wrapper" dangerouslySetInnerHTML={{ __html: wordInfo[word].customDefinition }}></div>
            }

            { apiDefinitions?.length ?
              <>
                { apiDefinitions.map((definition: Definition, index: number) => {
                  return <div key={`${definition.definition}-${index}`} className='focused-word__definition-wrapper'>
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
                          { definition.synonyms.map((synonym: string) => (
                            <span key={synonym} className="focused-word__synonym">
                              { synonym }
                            </span>
                          ))}
                        </div>
                      </>
                    }
                  </div>
                })}
              </>
              : <></>
            }
          </div>
          : <p>Definitions were not provided for this term. Please click on the Merriam Webster dictionary link instead.</p>
        }
      </div>
    </div>
  )
}

export default FocusedWord;
