import styles from "./avatar-stack.module.css";

export function AvatarStack() {
  return (
    <div aria-hidden="true" className={styles.stack}>
      <div className={styles.avatar}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className={styles.imageOne}
          src="/assets/avatars/avatar-1.png"
        />
      </div>

      <div className={styles.avatar}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className={styles.imageTwo}
          src="/assets/avatars/avatar-2.png"
        />
      </div>

      <div className={styles.avatar}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className={styles.imageThree}
          src="/assets/avatars/avatar-3.png"
        />
      </div>
    </div>
  );
}
