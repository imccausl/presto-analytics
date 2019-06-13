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

  span {
    &::after {
      content: "";
      background: #fff;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      border: 3px solid red;
      position: absolute;
      top: 0;
      left: -5px;
    }
  }

  &:last-of-type {
    div::before {
      border-left: none;
    }
  }
`;

const TimelineLine = styled.div`
  &::before {
    content: "";
    width: 1px;
    height: 100%;
    position: absolute;
    border-left: 3px solid red;
  }
`;

const TimelineItem = styled.div`
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
            <Label>{moment(key).fromNow()}</Label>
          </TimelineHeader>
          <TimelineContainer>
            {dataset[key].map(item => (
              <Timeline>
                <TimelineLine>
                  <span />
                  <TimelineTime
                    AM={
                      moment(item.date)
                        .utcOffset(0)
                        .format("A") === "AM"
                        ? true
                        : false
                    }
                    color={item.type === "Transfer" ? "orange" : "red"}>
                    {moment(item.date)
                      .utcOffset(0)
                      .format("hh:mm A")}
                  </TimelineTime>
                  <TimelineItem>
                    <Label color={item.type === "Transfer" ? "orange" : "red"}>
                      {item.type}
                    </Label>
                    {` ${item.location}`}
                  </TimelineItem>
                  <TimelineItem>
                    <Label color="green">{item.cardNumber}</Label>
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
