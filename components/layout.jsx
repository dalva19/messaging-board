import Nav from "./Nav";

export default function Layout({children}) {
  return (
    <div className="mx-7 md:max-w-2x1 mx-auto font-poppins">
      <Nav />
      <main>{children}</main>
    </div>
  )
}