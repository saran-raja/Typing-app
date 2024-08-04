import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import "./home.css";

const TypingApp = () => {
  const [typedWord, setTypedWord] = useState("");
  const [splittedWords, setSplittedWords] = useState([]);
  const [alphabet, setAlphabet] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [wordLength, setWordLength] = useState(4);
  console.log(typedWord);
  const fetchWords = useCallback(async () => {
    try {
      const randomNumber = Math.floor(Math.random() * (20 - 12) + 12);
      const url = `https://random-word-api.herokuapp.com/word?length=${4}&number=${randomNumber}`;

      const response = await axios.get(url);
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);
// wordLength
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
          setTypedWord((prevTypedWord) => prevTypedWord + event.key);

          if (currentLetterIndex + 1 === currentWord.length) {
            setCurrentWordIndex((prevIndex) => prevIndex + 1);
            setCurrentLetterIndex(0);
            setTypedWord("");

            if (currentWordIndex + 1 === splittedWords.length) {
              setLoading(true);
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

  // const handleWordLength = (event) => {
  //   if (event.target.name === "add") {
  //     setWordLength((prevLength) => prevLength + 1);
  //   } else if (event.target.name === "minus" && wordLength > 4) {
  //     setWordLength((prevLength) => prevLength - 1);
  //   }
  // };

  // console.log(wordLength);

  return (
    <div>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="home col-7">
            {/* <div className="d-flex">
              <button
                className="btn btn-primary"
                onClick={handleWordLength}
                name="minus"
              >
                -
              </button>
              <p>{wordLength}</p>
              <button
                className="btn btn-primary"
                onClick={handleWordLength}
                name="add"
              >
                +
              </button>
            </div> */}
            <div className="col-12 paracontent d-flex flex-column justify-content-center">
              <section className="col-12 para d-flex flex-row p-4">
                {loading ? (
                  <p>Loading words...</p>
                ) : splittedWords.length > 0 ? (
                  splittedWords.map((wordArr, index) => (
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
                      {"_"}
                    </p>
                  ))
                ) : (
                  <p>No words available.</p>
                )}
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
