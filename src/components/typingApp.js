import axios from "axios";
import React, { useEffect, useState } from "react";
import "./home.css";

const TypingApp = () => {
  const [splittedWords, setSplittedWords] = useState([]);
  const [alphabet, setAlphabet] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const randomNumber = Math.floor(Math.random() * (20 - 12) + 12);
  const randomLength = Math.floor(Math.random() * (7 - 4) + 4);
  const url = `https://random-word-api.herokuapp.com/word?length=${randomLength}&number=${randomNumber}`;

  const fetchWords = () => {
    axios
      .get(url)
      .then((response) => {
        const fetchedWords = response.data.map((word) => word + " ");
        setSplittedWords(
          fetchedWords.map((word) =>
            word.split("").map((letter) => ({
              letter,
              matched: false,
              incorrect: false,
            }))
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchWords();
  
    const alphabetArray = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );
    alphabetArray.push(" ");
    setAlphabet(alphabetArray);
  }, [fetchWords]);
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (splittedWords.length > 0) {
        const currentWord = splittedWords[currentWordIndex];
        const currentLetter = currentWord[currentLetterIndex].letter;
  
        if (event.key === currentLetter) {
          const updatedCurrentWord = currentWord.map((letterObj, index) => ({
            ...letterObj,
            matched: index <= currentLetterIndex ? true : letterObj.matched,
            incorrect:
              index === currentLetterIndex ? false : letterObj.incorrect,
          }));
          const updatedSplittedWords = [...splittedWords];
          updatedSplittedWords[currentWordIndex] = updatedCurrentWord;
  
          setSplittedWords(updatedSplittedWords);
          setCurrentLetterIndex((prevIndex) => prevIndex + 1);
  
          if (currentLetterIndex + 1 === currentWord.length) {
            setCurrentWordIndex((prevIndex) => prevIndex + 1);
            setCurrentLetterIndex(0);
  
            if (currentWordIndex + 1 === splittedWords.length) {
              fetchWords();
              setCurrentWordIndex(0);
            }
          }
        } else {
          const updatedCurrentWord = currentWord.map((letterObj, index) => ({
            ...letterObj,
            incorrect:
              index === currentLetterIndex ? true : letterObj.incorrect,
          }));
  
          const updatedSplittedWords = [...splittedWords];
          updatedSplittedWords[currentWordIndex] = updatedCurrentWord;
  
          setSplittedWords(updatedSplittedWords);
        }
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentWordIndex, currentLetterIndex, splittedWords, fetchWords]);
  
  return (
    <div>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="home col-7">
            <div className="col-12 paracontent d-flex flex-column justify-content-center">
              <section className="col-12 para d-flex flex-row p-4">
                {splittedWords.map((wordArr, index) => (
                  <p key={index}>
                    {wordArr.map((letterObj, id) => (
                      <span
                        key={id}
                        className={
                          index === currentWordIndex &&
                          id === currentLetterIndex
                            ? "current-letter"
                            : ""
                        }
                        style={{
                          color: letterObj.matched
                            ? "green"
                            : letterObj.incorrect
                            ? "red"
                            : "black",
                          textDecoration:
                            index === currentWordIndex &&
                            id === currentLetterIndex
                              ? "underline"
                              : "none",
                        }}
                      >
                        {letterObj.letter}
                      </span>
                    ))}
                    {" _"}
                  </p>
                ))}
              </section>
            </div>
            <section className="keys d-flex justify-content-center col-12 pt-5">
              {alphabet.map((item, index) => (
                <div key={index} className="col-2 key-item">
                  {item}
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingApp;
