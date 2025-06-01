import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { useLoaderData, Await } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const data = useLoaderData();

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postRespones}
              errorElement={<p>Error Loading Posts!</p>}
            >
              {(postRespones) => (
                <>
                  {postRespones.data.map((post) => (
                    <Card key={post.id} item={post} />
                  ))}
                </>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postRespones}
              errorElement={<p>Error Loading Posts!</p>}
            >
              {(postRespones) => (
                <>
                  <Map items={postRespones.data} />
                </>
              )}
              </Await>
          </Suspense>
        {/* Optional: Pass posts to map if needed */}
        {/* <Map items={data.postRespones.data} /> */}
      </div>
    </div>
  );
}

export default ListPage;
