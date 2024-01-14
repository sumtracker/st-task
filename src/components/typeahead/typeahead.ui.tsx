import { Input, List, Spin } from "antd";
import { ChangeEvent, FC } from "react";
import "./typehead.style.css";

const { Search } = Input;
type TypeaheadUI = {
  query: string | undefined;
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleFocus: (focus: boolean) => void;
  handleReset: () => void;
  inputFocused: boolean;
  contactsList: any;
  contactsListPagination: any;
  containerRef: any;
  loading: boolean;
};

const TypeaheadUI: FC<TypeaheadUI> = ({
  query,
  handleQueryChange,
  handleFocus,
  handleReset,
  inputFocused,
  contactsList,
  contactsListPagination,
  containerRef,
  loading,
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
          flex:9/10
        }}
      >
        <Search
          placeholder="Search contact by name"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => handleFocus(true)}
          onBlur={() => handleFocus(false)}
        />

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
          {inputFocused ? (
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
                    // onMouseDown={(e) => handleContactSelect(e)}
                  >
                    {item.company_name}
                  </List.Item>
                );
            }}
            loading={loading}
            locale={{ emptyText: "No Data" }}
            id="contacts-list"
          >
            {contactsListPagination.next ? (
              <Spin>
                <div
                  ref={containerRef}
                  style={{ height: "35px", overflow: "hidden" }}
                />
              </Spin>
            ) : null}
          </List>
          ) : null}
        </div>
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
          flex:1/10,
          textAlign:"center"
        }}
        onClick={handleReset}
      >
        <span>Reset</span>
      </div>
    </div>
  );
};

export default TypeaheadUI;
