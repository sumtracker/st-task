import { Spin } from "antd";
import React, { FC, useEffect, useRef } from "react";

type typeheadlistScrollProps = {
  children: React.ReactNode;
  hasMoreData:boolean,
  onLoadMore:()=>void;
  onSelectItem: (e: MouseEvent) => void;
};

const TypeheadlistScroll: FC<typeheadlistScrollProps> = ({
  onSelectItem,
  hasMoreData,
  onLoadMore,
  children,
}) => {
    
  const containerRef = useRef(null);

  const handleIntersection = (entries: any) => {
    const target = entries[0];
    console.log(target.isIntersecting, hasMoreData);

    if (target.isIntersecting && hasMoreData) {
      onLoadMore();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasMoreData]);

  useEffect(() => {
    const contactWrapper = document.getElementById("contact-wrapper");
    console.log(contactWrapper);
    if (contactWrapper) {
      contactWrapper.addEventListener("mousedown", onSelectItem);
    }
    return () =>
      contactWrapper?.removeEventListener("mousedown", onSelectItem);
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
      {hasMoreData ? (
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

export default TypeheadlistScroll;
