import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Buttons';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeader } from '../../components/shell/PageHeader';
import { workoutRepo } from '../../lib/repos/workoutRepo';
import type { WorkoutSession } from '../../lib/types';
import { formatTime } from '../../lib/utils/date';

export function WorkoutPage() {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState<WorkoutSession | undefined>();

  useEffect(() => {
    workoutRepo.getActiveSession().then(setActiveSession);
  }, []);

  async function handleQuickStart() {
    const session = await workoutRepo.startQuickSession();
    navigate('/workout/active', { state: { sessionId: session.id } });
  }

  return (
    <div className="page">
      <PageHeader title="Workout" subtitle="Quick start or resume your current session." />

      {activeSession ? (
        <Card title="Resume workout" subtitle={activeSession.title ?? 'Active session'}>
          <div className="stack-sm">
            <p className="muted">Started at {formatTime(activeSession.startTime)}</p>
            <Button block onClick={() => navigate('/workout/active')}>
              Resume workout
            </Button>
          </div>
        </Card>
      ) : (
        <Card title="Quick start">
          <div className="stack-sm">
            <p>Start a local-first session now. Every change saves to your device.</p>
            <Button block onClick={handleQuickStart}>
              Quick start workout
            </Button>
          </div>
        </Card>
      )}

      <Card title="Templates" subtitle="Template flow is reserved for the next upgrade.">
        <EmptyState
          title="Templates come next"
          body="The scaffold is ready for template support, but this build focuses on the core local-first workout flow first."
        />
      </Card>
    </div>
  );
}
