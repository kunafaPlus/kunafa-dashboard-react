import React, { ReactNode, ReactElement } from 'react';

/**
 * مكون Visible للتحكم في عرض أو إخفاء المكونات
 * @param {object} props - الخصائص
 * @param {boolean} props.when - الشرط الذي يحدد ما إذا كان سيتم عرض المكون أم لا
 * @param {ReactNode} [props.fallback] - العنصر البديل إذا لم يتم استيفاء الشرط (اختياري)
 * @param {ReactNode} props.children - العنصر الذي يتم عرضه إذا تم استيفاء الشرط
 * @returns {ReactNode}
 */
export const Visible = ({
  when,
  fallback = null,
  children,
}: {
  when: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}) => {
  return when ? children : fallback;
};

/**
 * مكون ConditionalRenderer لإدارة الحالات الشرطية وعرض fallback إذا لزم الأمر
 * @param {object} props - الخصائص
 * @param {ReactNode} props.fallback - العنصر البديل إذا لم يتم استيفاء أي شرط
 * @param {ReactNode} props.children - الحالات الشرطية (Condition)
 * @returns {ReactNode}
 */
export const ConditionalRenderer = ({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: ReactNode;
}) => {
  const matchedCondition = React.Children.toArray(children).find(
    (child: unknown): child is ReactElement<{ when: boolean; children: ReactNode }> => 
      React.isValidElement<{ when: boolean; children: ReactNode }>(child) &&
      'when' in child.props &&
      (child.props as { when: boolean }).when === true
  );

  return matchedCondition ? matchedCondition.props.children : fallback;
};

/**
 * مكون Condition لإدارة حالة فردية بناءً على شرط معين
 * @param {object} props - الخصائص
 * @param {boolean} props.when - الشرط الذي يحدد ما إذا كان سيتم عرض children أم لا
 * @param {ReactNode} props.children - العنصر الذي يتم عرضه إذا تم استيفاء الشرط
 * @returns {ReactNode}
 */
export const Condition = ({
  when,
  children,
}: {
  when: boolean;
  children: ReactNode;
}) => {
  return when ? children : null;
};

// أمثلة للاستخدام
export const Examples = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userRole, setUserRole] = React.useState<'admin' | 'user' | 'guest'>( 'guest' );

  return (
    <div>
      <h1>أمثلة استخدام المكونات الشرطية</h1>

      {/* مثال Visible */}
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
      <Visible when={isLoggedIn} fallback={<p>Please log in to continue.</p>}>
        <p>Welcome! You are logged in.</p>
      </Visible>

      {/* مثال ConditionalRenderer و Condition */}
      <select
        value={userRole}
        onChange={(e) =>
          setUserRole(e.target.value as 'admin' | 'user' | 'guest')
        }
      >
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="guest">Guest</option>
      </select>
      <ConditionalRenderer fallback={<p>No role selected.</p>}>
        <Condition when={userRole === 'admin'}>
          <p>Welcome, Admin! You have full access.</p>
        </Condition>
        <Condition when={userRole === 'user'}>
          <p>Welcome, User! You have limited access.</p>
        </Condition>
        <Condition when={userRole === 'guest'}>
          <p>Welcome, Guest! Please sign up for full access.</p>
        </Condition>
      </ConditionalRenderer>
    </div>
  );
};