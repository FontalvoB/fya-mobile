import React,{createContext,useContext,useState} from 'react';
import {Draft,Result,freshDraft,demoProfile} from '../domain/model';
type Session={draft:Draft;setDraft:React.Dispatch<React.SetStateAction<Draft>>;identity:boolean;setIdentity:(v:boolean)=>void;result:Result|null;setResult:(v:Result|null)=>void;demo:()=>void;reset:()=>void};
const Context=createContext<Session|null>(null);
export function SessionProvider({children}:{children:React.ReactNode}){const[draft,setDraft]=useState(freshDraft);const[identity,setIdentity]=useState(false);const[result,setResult]=useState<Result|null>(null);function reset(){setDraft(freshDraft());setIdentity(false);setResult(null);}function demo(){setDraft({...freshDraft(),profile:{...demoProfile}});setIdentity(true);setResult(null);}return <Context.Provider value={{draft,setDraft,identity,setIdentity,result,setResult,demo,reset}}>{children}</Context.Provider>;}
export function useSession(){const s=useContext(Context);if(!s)throw new Error('SessionProvider missing');return s;}
