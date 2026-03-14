import MainContent from "@/components/MainContent";
import { VariableStoreProvider } from "@/components/variableStore";

export default function Home() {
  return (
    <VariableStoreProvider>
      <MainContent />
    </VariableStoreProvider>
  );
}
