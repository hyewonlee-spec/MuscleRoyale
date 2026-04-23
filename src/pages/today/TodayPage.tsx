import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Buttons';
import { RatingPills } from '../../components/common/RatingPills';
import { SegmentedControl } from '../../components/common/SegmentedControl';
import { Field } from '../../components/common/Field';
import { PageHeader } from '../../components/shell/PageHeader';
import { useTodayData } from '../../hooks/useTodayData';
import { formatLongDate } from '../../lib/utils/date';
import { workoutRepo } from '../../lib/repos/workoutRepo';
import { getTodayDate } from '../../lib/utils/date';

export function TodayPage() {
  const navigate = useNavigate();
  const { checkin, cycleEntry, activeSession, profile, settings, readiness, updateCheckin } = useTodayData();

  async function startWorkout() {
    const session = activeSession ?? (await workoutRepo.startQuickSession());
    navigate('/workout/active', { state: { sessionId: session.id } });
  }

  return (
    <div className="page">
      <PageHeader title="Today" subtitle={formatLongDate(getTodayDate())} />

      {activeSession ? (
        <Card title="Resume workout" subtitle={activeSession.title ?? 'Active session'}>
          <div className="stack-sm">
            <p className="muted">Your session is still active and ready to continue.</p>
            <Button block onClick={() => navigate('/workout/active')}>
              Resume workout
            </Button>
          </div>
        </Card>
      ) : null}

      <Card title="Daily check-in" subtitle="Quick checkpoint before you train.">
        <div className="stack-md">
          <Field label="Energy">
            <RatingPills value={checkin?.energy} onChange={(value) => updateCheckin({ energy: value })} />
          </Field>
          <Field label="Sleep quality">
            <RatingPills value={checkin?.sleepQuality} onChange={(value) => updateCheckin({ sleepQuality: value })} />
          </Field>
          <Field label="Stress">
            <RatingPills value={checkin?.stress} onChange={(value) => updateCheckin({ stress: value })} />
          </Field>
          <Field label="Soreness">
            <RatingPills value={checkin?.soreness} onChange={(value) => updateCheckin({ soreness: value })} />
          </Field>
          <Field label="Motivation">
            <RatingPills value={checkin?.motivation} onChange={(value) => updateCheckin({ motivation: value })} />
          </Field>
          <Field label="Pain present">
            <SegmentedControl
              value={checkin?.painPresent ? 'yes' : 'no'}
              options={[
                { label: 'No', value: 'no' },
                { label: 'Yes', value: 'yes' },
              ]}
              onChange={(value) => updateCheckin({ painPresent: value === 'yes' })}
            />
          </Field>
          {checkin?.painPresent ? (
            <Field label="Pain notes">
              <textarea
                className="input textarea"
                placeholder="Where is it showing up today?"
                value={checkin?.painNotes ?? ''}
                onChange={(event) => updateCheckin({ painNotes: event.target.value })}
              />
            </Field>
          ) : null}
        </div>
      </Card>

      <Card title="Readiness" subtitle={`${readiness.score}/100 • ${readiness.label}`}>
        <p>{readiness.message}</p>
      </Card>

      {profile?.cycleTrackingEnabled && settings?.showCycleInsights ? (
        <Card
          title="Cycle context"
          subtitle={cycleEntry?.phase ? `${cycleEntry.phase} phase` : 'No entry logged today'}
          tone="plum"
          action={<Link className="inline-link" to="/cycle">Open</Link>}
        >
          <p>
            {cycleEntry
              ? 'Use cycle context as support, not a rule.'
              : 'Track today if you want cycle-aware context on this screen.'}
          </p>
        </Card>
      ) : null}

      <Card title="Start workout" subtitle="Simple, local, and interruption-safe.">
        <Button block onClick={startWorkout}>
          {activeSession ? 'Resume workout' : 'Start workout'}
        </Button>
      </Card>
    </div>
  );
}
