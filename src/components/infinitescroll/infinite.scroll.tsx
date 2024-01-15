import { Spin } from "antd";
import React, { FC, useEffect, useRef } from "react";

type InfiniteScroll = {
  children: React.ReactNode;
  hasMore:boolean,
  loadMore:()=>void;
  handleContactSelect: (e: MouseEvent) => void;
};
const InfiniteScroll: FC<InfiniteScroll> = ({
  handleContactSelect,
  hasMore,
  loadMore,
  children,
}) => {
    
  const containerRef = useRef(null);
  // Callback for the Intersection Observer
  const handleIntersection = (entries: any) => {
    const target = entries[0];
    console.log(target.isIntersecting, hasMore);

    if (target.isIntersecting && hasMore) {
      // Load more data when the target becomes visible
      loadMore();
    }
  };

  // Set up Intersection Observer when the component mounts
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Trigger callback when 10% of the target is in view
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasMore]);
  useEffect(() => {
    const contactWrapper = document.getElementById("contact-wrapper");
    console.log(contactWrapper);
    if (contactWrapper) {
      contactWrapper.addEventListener("mousedown", handleContactSelect);
    }
    return () =>
      contactWrapper?.removeEventListener("mousedown", handleContactSelect);
  }, []);
  return (
    <div
      id="contact-wrapper"
      style={{
        zIndex: 1000,
        backgroundColor: "#fefefe",
        boxShadow: "0 0 10px #e2e2e2",
        margin: "5px 0",
        borderRadius: "6px",
        position: "absolute",
        width: "100%",
        maxHeight: "400px",
        overflowY: "auto",
        top: "105%",
      }}
    >
      {children}
      {hasMore ? (
        <Spin>
          <div
            ref={containerRef}
            style={{ height: "35px", overflow: "hidden" }}
          />
        </Spin>
      ) : null}
    </div>
  );
};

export default InfiniteScroll;
