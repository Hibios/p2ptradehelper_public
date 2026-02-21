// @START_JQ4LES1S
import { Metadata } from 'next';
import SemanticAnalyzer from './AppAST';

export const metadata: Metadata = {
  title: 'UI Creator',
 }

 
export default function EditorWrap() {
    return (
      <div className='w-full pl-3 pt-3'>
        <SemanticAnalyzer/>
      </div>
  );
}
// @END_1P8IHPOQ
