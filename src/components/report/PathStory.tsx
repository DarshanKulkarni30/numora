type PathStoryProps = {
  feel: string;
  atmosphere: string;
  invitation: string;
  looksLike?: string;
  helps?: string[];
  watch?: string[];
  dark?: boolean;
};

export function PathStory({
  feel,
  atmosphere,
  invitation,
  looksLike,
  helps,
  watch,
  dark,
}: PathStoryProps) {
  const label = dark ? "text-sand" : "text-ink";
  const muted = dark ? "text-paper/85" : "text-ink-soft";

  return (
    <dl className={`space-y-2.5 text-xs leading-5 ${muted}`}>
      <div>
        <dt className={label}>How the shift may feel</dt>
        <dd className="mt-0.5">{feel}</dd>
      </div>
      {looksLike ? (
        <div>
          <dt className={label}>Where this can show up</dt>
          <dd className="mt-0.5">{looksLike}</dd>
        </div>
      ) : null}
      {helps && helps.length ? (
        <div>
          <dt className={label}>What this stretch can support</dt>
          <dd className="mt-0.5">
            <ul className="list-disc space-y-1 pl-4">
              {helps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
      ) : null}
      {watch && watch.length ? (
        <div>
          <dt className={label}>What to watch</dt>
          <dd className="mt-0.5">
            <ul className="list-disc space-y-1 pl-4">
              {watch.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
      ) : null}
      <div>
        <dt className={label}>Life atmosphere</dt>
        <dd className="mt-0.5">{atmosphere}</dd>
      </div>
      <div>
        <dt className={label}>Growth invitation</dt>
        <dd className="mt-0.5">{invitation}</dd>
      </div>
    </dl>
  );
}
