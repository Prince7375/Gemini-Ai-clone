import { createContext, useState } from "react";
import { runchat } from "../config/gemini";


export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setinput] = useState("");                 //To get input and save that input of the user
    const [recentPrompt, setrecentPrompt] = useState("");   //To save and display it on the main Component 
    const [prevPrompts, setprevPrompts] = useState([]);     //To save the previous prompts to the sidebar recent tab
    const [showResult, setshowResult] = useState(false);    //To display the result on the main Component
    const [loading, setloading] = useState(false);          //If it is true we will show loading animation
    const [resultData, setresultData] = useState("");       //To display the result data on the main Component

    const delayPara = (index,nextWord) => {
        setTimeout(function() {
            setresultData(prev=>prev+nextWord);
        },75*index);
    }

    const newChat = () => {
        setloading(false)
        setshowResult(false)
    }
    
    const onSent = async (prompt)=>{

        setresultData("")
        setloading(true)
        setshowResult(true)
        let response;
        if (prompt !== undefined) {
            response = await runchat(prompt)
            setrecentPrompt(prompt)
        }else
        {
            setprevPrompts(prev=>[...prev,input])
            setrecentPrompt(input)
            response = await runchat(input)
        }
        

        let responseArray = response.split("**")
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i%2 !== 1) {
                newResponse += responseArray[i];
            }
            else{
                newResponse += "</br><b>"+responseArray[i]+"</b>";
            }
            
        }

        let newResponse2 = newResponse.split("*").join("</br>");

        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
            
        }
        setloading(false)
        setinput("")
    }

    const contextValue = {
        prevPrompts,
        setprevPrompts,
        onSent,
        setrecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setinput,
        newChat
    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;