export default function Message ({children, description, avatar, username}) {
  return (
    <div className="bg-white p-8 border-b-2 rounded-lg">
      <div className="flex items-center gap-2">
        <img src={avatar} className="rounded-full w-10"/>
        <h2>{username}</h2>
      </div>

      <div className="py-4">
        <p>{description}</p>
      </div>

      {children}
    </div>
  )
};