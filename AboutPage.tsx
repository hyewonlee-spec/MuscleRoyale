import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Buttons';
import { PageHeader } from '../../components/shell/PageHeader';
import { useActiveWorkout } from '../../hooks/useActiveWorkout';
import type { WorkoutSessionItem } from '../../lib/types';

function SessionItemCard({
  item,
  setCount,
  children,
}: {
  item: WorkoutSessionItem;
  setCount: number;
  children: ReactNode;
}) {
  return (
    <Card title={item.exerciseNameSnapshot} subtitle={`${setCount} set${setCount === 1 ? '' : 's'}`}>
      {children}
    </Card>
  );
}

export function ActiveWorkoutPage() {
  const navigate = useNavigate();
  const { session, items, setLogs, availableExercises, elapsedLabel, startQuickSession, addExercise, addSet, updateSet, finishSession, abandonSession } =
    useActiveWorkout();

  if (!session) {
    return (
      <div className="page">
        <PageHeader title="Active workout" subtitle="No active session yet." />
        <Card title="Start a session">
          <div className="stack-sm">
            <p>Create a new workout and start logging straight away.</p>
            <Button block onClick={startQuickSession}>
              Start quick session
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader title={session.title ?? 'Today’s workout'} subtitle={`Elapsed: ${elapsedLabel || '0m'}`} />

      <Card title="Session actions">
        <div className="button-row">
          <Button variant="secondary" onClick={() => finishSession()}>
            Finish
          </Button>
          <Button variant="danger" onClick={() => abandonSession().then(() => navigate('/workout'))}>
            Abandon
          </Button>
        </div>
      </Card>

      {items.length === 0 ? (
        <Card title="Add your first exercise" subtitle="Pick from the seeded exercise list below.">
          <div className="chip-list">
            {availableExercises.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                className="chip"
                onClick={() => addExercise(exercise)}
              >
                {exercise.name}
              </button>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="stack-lg">
        {items.map((item) => {
          const itemSets = setLogs.filter((set) => set.sessionItemId === item.id);
          return (
            <SessionItemCard key={item.id} item={item} setCount={itemSets.length}>
              <div className="stack-md">
                {itemSets.map((set) => (
                  <div key={set.id} className="set-row">
                    <div className="set-row__meta">Set {set.setNumber}</div>
                    <input
                      className="input"
                      inputMode="decimal"
                      placeholder="kg"
                      value={set.weight ?? ''}
                      onChange={(event) =>
                        updateSet(set.id, {
                          weight: event.target.value ? Number(event.target.value) : undefined,
                        })
                      }
                    />
                    <input
                      className="input"
                      inputMode="numeric"
                      placeholder="reps"
                      value={set.reps ?? ''}
                      onChange={(event) =>
                        updateSet(set.id, {
                          reps: event.target.value ? Number(event.target.value) : undefined,
                        })
                      }
                    />
                    <button
                      type="button"
                      className={`set-check ${set.completed ? 'is-complete' : ''}`}
                      onClick={() => updateSet(set.id, { completed: !set.completed })}
                    >
                      {set.completed ? 'Done' : 'Mark'}
                    </button>
                  </div>
                ))}
                <Button variant="secondary" block onClick={() => addSet(item)}>
                  Add set
                </Button>
              </div>
            </SessionItemCard>
          );
        })}
      </div>

      <Card title="Add another exercise">
        <div className="chip-list">
          {availableExercises.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              className="chip"
              onClick={() => addExercise(exercise)}
            >
              {exercise.name}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
