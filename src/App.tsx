import './styles/App.css'
import { useEffect, useState } from "react";
import {supabase} from "./libs/supabaseClient";

type Instrument = {
  id: string;
  name: string;
};
function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  useEffect(() => {
    getInstruments();
  }, []);
  async function getInstruments() {
    const { data } = await supabase.from("instruments").select();
    setInstruments(data || []);
  }

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <button className="btn">Button</button>
      <ul>
      {instruments.map((instrument) => (
        <li key={instrument.name}>{instrument.name}</li>
      ))}
    </ul>
    </>
  )
}

export default App
