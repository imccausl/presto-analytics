import moment from "moment";
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Segment, Feed, Icon, Label } from "semantic-ui-react";
import { groupByDate } from "../../../lib/transactions";

const propTypes = {};
const defaultProps = {};

const Timeline = styled.li`
  position: relative;

  span.dot {
    &::after {
      content: "";
      background: #fff;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      border: 3px solid ${props => props.color || "blue"};
      position: absolute;
      top: 0;
      left: -5px;
    }
  }

  &:last-of-type {
    section::before {
      border-left: none;
    }
  }
`;

const TimelineLine = styled.section`
  &::before {
    content: "";
    width: 1px;
    height: 100%;
    position: absolute;
    border-left: 3px solid ${props => props.color || "blue"};
  }
`;

const TimelineItem = styled.div`
  display: flex;
  flex-flow: row nowrap;

  position: relative;
  margin-left: 10px;
  padding: 0 0 10px 10px;
`;

const TimelineContainer = styled.ul`
  list-style: none;
  margin: 0;
  margin-top: 15px;
  margin-bottom: 40px;
  list-style: none;
  position: relative;
  padding: 1px 100px;
  color: #000;
  font-size: 13px;
`;

const TimelineTime = styled.div`
  position: absolute;
  left: ${props => (props.AM === true ? "-70px" : "-69px")};
  font-weight: 900;
  top: -2px;
  color: ${props => props.color};
`;

const TimelineHeader = styled.div`
  margin-left: 120px;
`;

const TimelineLocation = styled.div`
  border-top: 1px solid lightgrey;
  margin-top: 8px;
  padding-top: 5px;
  font-weight: bold;
`;

const TimelineInfoContainer = styled.div`
  /* position: absolute;
  top: 0;
  left: 100px; */
`;

const TimelineInfo = styled.div`
  position: relative;
  border: 1px solid lightgrey;
  width: 335px;
  border-radius: 0.25rem;
  padding: 10px;
  margin-left: 15px;

  &:hover {
    box-shadow: 0px 1px 2px 0 rgba(34, 36, 38, 0.15);
  }

  &::before {
    position: absolute;
    content: "";

    background: #fff;
    top: 5px;
    left: -1px;
    width: 10px;
    height: 10px;
    border-left: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;

    transform: translateX(-50%) rotate(45deg);
  }
`;

export default function RecentActivity(props) {
  const { data, loading, error } = props;
  let dataset = [];

  if (!loading && !error) {
    dataset = groupByDate(data.data.transactions);
  }

  console.log(dataset);
  const FeedItems = () => {
    return Object.keys(dataset)
      .sort((a, b) => (a < b ? 1 : -1))
      .map(key => (
        <>
          <TimelineHeader>
            <Label>
              {moment(key)
                .utcOffset(0)
                .format("D MMM YYYY")}
            </Label>
          </TimelineHeader>
          <TimelineContainer>
            {dataset[key].map(item => (
              <Timeline color={item.type === "Transfer" ? "orange" : "blue"}>
                <TimelineLine
                  color={item.type === "Transfer" ? "orange" : "blue"}>
                  <span className="dot" />
                  <TimelineTime
                    AM={
                      moment(item.date)
                        .utcOffset(0)
                        .format("A") === "AM"
                        ? true
                        : false
                    }
                    color={item.type === "Transfer" ? "orange" : "blue"}>
                    {moment(item.date)
                      .utcOffset(0)
                      .format("hh:mm A")}
                  </TimelineTime>
                  <TimelineItem>
                    <div>
                      <Label
                        color={item.type === "Transfer" ? "orange" : "blue"}>
                        {item.type === "Transfer"
                          ? "Transfer".toUpperCase()
                          : "Fare Paid".toUpperCase()}
                      </Label>
                    </div>
                    <TimelineInfoContainer>
                      <TimelineInfo>
                        <div
                          style={{
                            display: "flex",
                            flexFlow: "row nowrap",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}>
                          <Label color="green">{item.cardNumber}</Label>
                          <div>
                            {item.type === "Transfer"
                              ? ""
                              : `$${(
                                  Math.round(item.amount * 100) / 10000
                                ).toFixed(2)}`}
                          </div>
                        </div>
                        <TimelineLocation>{`${
                          item.location
                        }`}</TimelineLocation>
                      </TimelineInfo>
                    </TimelineInfoContainer>
                  </TimelineItem>
                </TimelineLine>
              </Timeline>
            ))}
          </TimelineContainer>
        </>
      ));
  };
  return (
    <Segment
      //   style={{ minHeight: "450px", maxHeight: "450px", overflowY: "auto" }}
      vertical>
      {!loading && !error && FeedItems()}
    </Segment>
  );
}

RecentActivity.propTypes = propTypes;
RecentActivity.defaultProps = defaultProps;
