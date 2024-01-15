import { Input, List, Spin } from "antd";
import { ChangeEvent, FC } from "react";
import "./typehead.style.css";
import InfiniteScroll from "../infinitescroll/infinite.scroll";

const { Search } = Input;
type TypeaheadUI = {
  query: string | undefined;
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleFocus: (focus: boolean) => void;
  handleReset: () => void;
  inputFocused: boolean;
  contactsList: any;
  contactsListPagination: any;
  // containerRef: any;
  loading: boolean;
  handleContactSelect:(e:MouseEvent)=>void
  loadMore:()=>void
};

const TypeaheadUI: FC<TypeaheadUI> = ({
  query,
  handleQueryChange,
  handleFocus,
  handleReset,
  inputFocused,
  contactsList,
  contactsListPagination,
  loading,
  handleContactSelect,
  loadMore
}) => {
  return (
    <div
      style={{
        width: "35%",
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          flex: 9 / 10,
        }}
      >
        <Search
          placeholder="Search contact by name"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => handleFocus(true)}
          onBlur={() => handleFocus(false)}
        />

        {inputFocused ? (
          <InfiniteScroll
            handleContactSelect={handleContactSelect}
            hasMore={contactsListPagination.next}
            loadMore={loadMore}
          >
            <List
              dataSource={contactsList}
              renderItem={(item: any) => {
                if (item.company_name)
                  return (
                    //show the item which have company name
                    <List.Item
                      key={item.id}
                      data-contactid={item.id}
                      data-value={item.company_name}
                    >
                      {item.company_name}
                    </List.Item>
                  );
              }}
              loading={loading}
              locale={{ emptyText: "No Data" }}
              id="contacts-list"
            >
            </List>
          </InfiniteScroll>
        ) : null}
      </div>
      <div
        style={{
          outline: "none",
          height: "31.6px",
          backgroundColor: "transparent",
          border: "1px solid #d9d9d9",
          borderRadius: "6px",
          color: "#252525",
          cursor: "pointer",
          padding: "5px 15px",
          flex: 1 / 10,
          textAlign: "center",
        }}
        onClick={handleReset}
      >
        <span>Reset</span>
      </div>
    </div>
  );
};

export default TypeaheadUI;
