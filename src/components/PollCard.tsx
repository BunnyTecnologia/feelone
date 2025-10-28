import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  texto_opcao: string;
  votes: number;
}

interface PollCardProps {
  pollId: string;
  question: string;
  options: Option[];
  totalVotes: number;
  userVotedOptionId: string | null;
  onVote: (pollId: string, optionId: string) => void;
  showResults: boolean;
}

const PollCard: React.FC<PollCardProps> = ({
  pollId,
  question,
  options,
  totalVotes,
  userVotedOptionId,
  onVote,
  showResults,
}) => {
  const handleVote = (optionId: string) => {
    if (!userVotedOptionId) {
      onVote(pollId, optionId);
    }
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <Card className="shadow-lg border-2 border-[#3A00FF] rounded-xl bg-white dark:bg-gray-800">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xl font-bold text-[#3A00FF]">{question}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        {options.map((option) => {
          const percentage = getPercentage(option.votes);
          const isVoted = option.id === userVotedOptionId;
          const isInteractive = !userVotedOptionId;

          return (
            <div key={option.id} className="relative">
              <Button
                onClick={() => handleVote(option.id)}
                disabled={!isInteractive}
                variant="outline"
                className={cn(
                  "w-full justify-start h-12 text-base font-medium transition-all duration-300 relative overflow-hidden",
                  "border-2 border-[#3A00FF] text-gray-900 dark:text-white",
                  isInteractive ? "hover:bg-[#D9D0FF]" : "cursor-default",
                  isVoted && "bg-[#D9D0FF] border-[#3A00FF] text-[#3A00FF] font-bold"
                )}
              >
                {/* Barra de Progresso (Resultados) */}
                {showResults && (
                  <div
                    className="absolute inset-0 bg-[#D9D0FF]/50 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                )}
                
                <span className="relative z-10 flex justify-between items-center w-full">
                  <span>{option.texto_opcao}</span>
                  {showResults && (
                    <span className={cn("text-sm font-bold", isVoted ? "text-[#3A00FF]" : "text-gray-700 dark:text-gray-300")}>
                      {percentage}% ({option.votes})
                    </span>
                  )}
                  {isVoted && <CheckCircle className="h-5 w-5 text-[#3A00FF] ml-2" />}
                </span>
              </Button>
            </div>
          );
        })}
        
        {showResults && totalVotes > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 pt-2 flex items-center justify-end">
            <BarChart2 className="h-4 w-4 mr-1" /> Total de votos: {totalVotes}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PollCard;