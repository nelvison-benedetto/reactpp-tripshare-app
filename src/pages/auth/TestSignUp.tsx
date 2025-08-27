import { useState } from "react";
import { useSignUp } from "../../query/hooks/user/useAuthMutations";

export default function TestSignUp(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const signUpMutation = useSignUp();

    const handleSignUp = async () => {
    try {
        const result = await signUpMutation.mutateAsync({ email, password });
        console.log("Nuovo utente creato:", result.user);
    } catch (error) {
        console.error("Errore signup:", error);
    }
    };

    return (
      <>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      </>
    );
}