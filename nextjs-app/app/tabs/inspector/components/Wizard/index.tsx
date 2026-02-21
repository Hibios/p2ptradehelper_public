'use client';

interface WizardProps {
  currentStep: 'project' | 'folders' | 'files' | 'ast';
  onBack: () => void;
}

export function Wizard({ currentStep, onBack }: WizardProps) {
  const steps = [
    { id: 'project', label: 'Project', icon: '📁' },
    { id: 'folders', label: 'Folders', icon: '📂' },
    { id: 'files', label: 'Files', icon: '📄' },
    { id: 'ast', label: 'AST', icon: '🌳' },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          disabled={currentStep === 'project'}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">AST Explorer</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200"></div>
        
        {/* Progress fill */}
        <div 
          className="absolute top-5 left-0 h-1 bg-blue-600 transition-all duration-500"
          style={{ 
            width: `${(steps.findIndex(s => s.id === currentStep) + 1) * 25}%` 
          }}
        ></div>

        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-lg
                  border-2 transition-all duration-300 z-10
                  ${isActive ? 'bg-blue-600 border-blue-600 text-white scale-110' : ''}
                  ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-white border-gray-300 text-gray-400' : ''}
                `}>
                  {step.icon}
                </div>
                <span className={`mt-2 text-sm font-medium
                  ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}